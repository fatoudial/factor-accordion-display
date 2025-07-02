import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

interface GenerationResult {
  success: boolean;
  bookId?: string;
  bookUrl?: string;
  message: string;
  pages?: number;
  error?: string;
}

const BookGeneration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('Mon Livre Souvenir');
  const [format, setFormat] = useState('pdf');
  const [style, setStyle] = useState('modern');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<GenerationResult | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.name.toLowerCase().endsWith('.zip')) {
        setFile(selectedFile);
        setResult(null);
      } else {
        toast({
          title: "Format invalide",
          description: "Seuls les fichiers ZIP sont acceptés",
          variant: "destructive",
        });
      }
    }
  };

  const generateBook = async () => {
    if (!file || !user) {
      toast({
        title: "Erreur",
        description: "Fichier ZIP et authentification requis",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('format', format);
      formData.append('style', style);

      // Simuler le progrès
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const token = localStorage.getItem('authToken') || '';
      const response = await fetch(`${API_BASE_URL}/books/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data: GenerationResult = await response.json();
      setResult(data);

      if (data.success) {
        toast({
          title: "Livre généré avec succès !",
          description: `Votre livre "${title}" est prêt avec ${data.pages || 0} pages.`,
        });
      } else {
        toast({
          title: "Erreur de génération",
          description: data.error || "Une erreur est survenue",
          variant: "destructive",
        });
      }

    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter au serveur",
        variant: "destructive",
      });
      setResult({
        success: false,
        message: "Erreur de connexion au serveur",
        error: error.message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadBook = async () => {
    if (!result?.bookId || !user) return;

    try {
      const token = localStorage.getItem('authToken') || '';
      const response = await fetch(`${API_BASE_URL}/books/download/${result.bookId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: "Téléchargement démarré",
          description: "Votre livre est en cours de téléchargement",
        });
      } else {
        throw new Error('Erreur de téléchargement');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le livre",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Générateur de Livres
          </CardTitle>
          <CardDescription>
            Uploadez un fichier ZIP contenant vos conversations pour générer automatiquement votre livre souvenir.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration du livre */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du livre</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Mon Livre Souvenir"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="epub">EPUB</SelectItem>
                  <SelectItem value="docx">Word (DOCX)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="style">Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Moderne</SelectItem>
                  <SelectItem value="classic">Classique</SelectItem>
                  <SelectItem value="elegant">Élégant</SelectItem>
                  <SelectItem value="minimalist">Minimaliste</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Upload de fichier */}
          <div className="space-y-4">
            <Label htmlFor="file">Fichier ZIP des conversations</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <Input
                id="file"
                type="file"
                accept=".zip"
                onChange={handleFileChange}
                className="hidden"
              />
              <Label htmlFor="file" className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span>Choisir un fichier ZIP</span>
                </Button>
              </Label>
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Fichier sélectionné: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>

          {/* Progrès de génération */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Génération en cours...</span>
                <span className="text-sm text-gray-500">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-gray-500 text-center">
                Traitement des conversations et génération des pages...
              </p>
            </div>
          )}

          {/* Résultat */}
          {result && (
            <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
                  {result.message}
                  {result.pages && (
                    <span className="block mt-1 text-sm">
                      Livre généré avec {result.pages} pages
                    </span>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
            >
              Retour
            </Button>
            
            <div className="flex gap-2">
              {result?.success && result.bookId && (
                <Button onClick={downloadBook} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </Button>
              )}
              
              <Button 
                onClick={generateBook} 
                disabled={!file || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Générer le livre
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Instructions:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Exportez vos conversations depuis WhatsApp, Instagram, ou Facebook</li>
                <li>Compressez tous les fichiers dans un seul fichier ZIP</li>
                <li>Le traitement peut prendre 2-5 minutes selon la taille</li>
                <li>Formats supportés: JSON, TXT, HTML</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookGeneration;