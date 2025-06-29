
import { Router } from 'express';
import { BookDesign } from '../types';
import fs from 'fs';
import path from 'path';

const router = Router();

// Stocker temporairement les statuts des designs (en production, utiliser une base de données)
const bookStatuses = new Map<string, {
  status: 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  message?: string;
  previewUrl?: string;
  createdAt: Date;
}>();

router.post('/create', async (req, res) => {
  try {
    const design: BookDesign = req.body;
    
    // Générer un ID unique pour ce design
    const designId = Date.now().toString();
    
    // Stocker l'état initial du processus
    bookStatuses.set(designId, {
      status: 'processing',
      progress: 0,
      message: 'Initialisation du processus de création',
      createdAt: new Date()
    });
    
    // Simuler le processus de création en arrière-plan
    processBookCreation(designId, design);
    
    res.json({ 
      success: true,
      message: 'Book creation initiated',
      designId: designId,
      id: parseInt(designId) // Pour rester compatible avec le frontend
    });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ error: 'Error creating book' });
  }
});

router.get('/status/:designId', (req, res) => {
  const { designId } = req.params;
  
  // Récupérer le statut du design
  const status = bookStatuses.get(designId);
  
  if (!status) {
    return res.status(404).json({ error: 'Design not found' });
  }
  
  res.json(status);
});

router.put('/:designId/cancel', (req, res) => {
  const { designId } = req.params;
  
  const status = bookStatuses.get(designId);
  
  if (!status) {
    return res.status(404).json({ error: 'Design not found' });
  }
  
  // Annuler uniquement si toujours en cours
  if (status.status === 'processing') {
    status.status = 'cancelled';
    status.message = 'Création annulée par l\'utilisateur';
    bookStatuses.set(designId, status);
  }
  
  res.json({ success: true, status });
});

// Fonction qui simule le processus de création de livre en arrière-plan
async function processBookCreation(designId: string, design: BookDesign) {
  // Simuler un processus par étapes
  const steps = [
    { progress: 10, message: 'Préparation des messages...' },
    { progress: 25, message: 'Génération de la mise en page...' },
    { progress: 40, message: 'Application du style visuel...' },
    { progress: 60, message: 'Optimisation des images...' },
    { progress: 75, message: 'Génération des illustrations IA...' },
    { progress: 90, message: 'Finalisation du document...' },
    { progress: 100, message: 'Livre terminé!' }
  ];
  
  // Pour chaque étape, mettre à jour le statut après un délai
  for (const step of steps) {
    // Vérifier si la création a été annulée
    const currentStatus = bookStatuses.get(designId);
    if (!currentStatus || currentStatus.status === 'cancelled') {
      return;
    }
    
    // Attendre un délai aléatoire pour simuler le traitement
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Mettre à jour le statut
    bookStatuses.set(designId, {
      ...currentStatus,
      progress: step.progress,
      message: step.message,
      // Ajouter une URL de prévisualisation à la fin
      ...(step.progress === 100 ? { previewUrl: `/preview/${designId}.pdf` } : {})
    });
  }
  
  // Mettre à jour le statut final
  const finalStatus = bookStatuses.get(designId);
  if (finalStatus) {
    bookStatuses.set(designId, {
      ...finalStatus,
      status: 'completed'
    });
  }
}

export { router };
