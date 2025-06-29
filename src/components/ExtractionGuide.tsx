
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, Instagram, Facebook, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

const ExtractionGuide = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("instagram");
  const { t, language } = useLanguage();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const goToDesigner = () => {
    navigate('/designer');
  };

  return (
    <section className="py-12 bg-ts-sand/50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-serif font-semibold text-ts-forest mb-8 text-center">
          Comment extraire vos conversations
        </h2>
        
        <Tabs defaultValue="instagram" className="w-full max-w-3xl mx-auto" onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="instagram" className={`${activeTab === "instagram" ? "bg-pink-500 text-white" : ""} transition-all duration-200`}>
              <div className="flex items-center">
                <Instagram className="mr-2 h-4 w-4" />
                Instagram
              </div>
            </TabsTrigger>
            <TabsTrigger value="facebook" className={`${activeTab === "facebook" ? "bg-blue-500 text-white" : ""} transition-all duration-200`}>
              <div className="flex items-center">
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </div>
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className={`${activeTab === "whatsapp" ? "bg-green-500 text-white" : ""} transition-all duration-200`}>
              <div className="flex items-center">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </div>
            </TabsTrigger>
          </TabsList>
          
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <TabsContent value="instagram" className="space-y-6">
                <div className="bg-pink-50 p-6 rounded-lg border border-pink-100">
                  <h3 className="text-xl font-semibold text-pink-700 mb-6">
                    Souvenez-vous de ces messages marquants sur Instagram ?
                  </h3>
                  
                  <p className="mb-4">
                    Imaginez-les transformés en un livre, un trésor de souvenirs à parcourir sans fin.
                    En quelques clics, convertissez vos échanges Instagram en un livre personnalisé. 
                    Préservez vos souvenirs les plus précieux et offrez un cadeau unique à vos proches !
                  </p>
                  
                  <div className="space-y-8 mt-8">
                    {/* Étape 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">1</div>
                          <div>
                            <h4 className="font-medium text-pink-800">Ouvrez votre application Instagram</h4>
                            <p className="text-gray-700 mt-2">Pour commencer, ouvrez l'application Instagram sur votre téléphone et accédez à votre profil en appuyant sur votre photo de profil en bas à droite.</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <div className="w-[220px] h-[400px] bg-gray-200 rounded-xl border-4 border-pink-100 shadow-lg overflow-hidden relative flex justify-center items-center">
                          {/* Placeholder pour l'image générée d'Instagram */}
                          <div className="absolute inset-0 bg-gradient-to-b from-pink-200 to-pink-400 opacity-50"></div>
                          <div className="absolute inset-0 flex flex-col items-center justify-start pt-10">
                            <div className="w-full px-4 flex items-center justify-between">
                              <div className="text-lg font-bold text-pink-800">Instagram</div>
                              <div className="flex space-x-2">
                                <div className="w-4 h-4 rounded-full bg-pink-800"></div>
                                <div className="w-4 h-4 rounded-full bg-pink-800"></div>
                              </div>
                            </div>
                            <div className="flex-1 w-full flex flex-col items-center justify-center">
                              <div className="rounded-full w-20 h-20 bg-pink-300 mb-2 border-2 border-white flex items-center justify-center">
                                <svg viewBox="0 0 24 24" fill="white" className="w-12 h-12">
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                              </div>
                              <div className="text-pink-800 font-medium">Votre profil</div>
                            </div>
                            <div className="w-full h-16 bg-white border-t border-pink-200 flex justify-around items-center px-4">
                              <div className="w-6 h-6 bg-pink-800 rounded-sm"></div>
                              <div className="w-6 h-6 bg-pink-800 rounded-full"></div>
                              <div className="w-6 h-6 bg-pink-800 rounded-sm"></div>
                              <div className="w-6 h-6 bg-pink-800 rounded-full border-2 border-pink-500"></div>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 mt-3">Accédez à votre profil Instagram</span>
                      </div>
                    </div>
                    
                    {/* Étape 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">2</div>
                          <div>
                            <h4 className="font-medium text-pink-800">Accédez aux paramètres</h4>
                            <p className="text-gray-700 mt-2">Dans votre profil, appuyez sur l'icône du menu (trois traits horizontaux) en haut à droite. Puis, sélectionnez "Paramètres et confidentialité" dans le menu qui apparaît.</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <div className="w-[220px] h-[400px] bg-gray-200 rounded-xl border-4 border-pink-100 shadow-lg overflow-hidden relative flex justify-center items-center">
                          {/* Placeholder pour l'image générée des paramètres Instagram */}
                          <div className="absolute inset-0 bg-gradient-to-b from-pink-100 to-pink-200"></div>
                          <div className="absolute inset-0 flex flex-col">
                            <div className="w-full h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
                              <div className="font-medium text-black">Profil</div>
                              <div className="w-8 h-8 rounded-full flex items-center justify-center border border-pink-300">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-pink-800">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                              </div>
                            </div>
                            <div className="flex-1 bg-white">
                              {/* Menu déroulant */}
                              <div className="absolute right-2 top-16 w-48 bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200 z-10">
                                <div className="p-3 border-b border-gray-100 hover:bg-gray-50">Archives</div>
                                <div className="p-3 border-b border-gray-100 hover:bg-gray-50">Activité</div>
                                <div className="p-3 border-b border-gray-100 hover:bg-gray-50">Code QR</div>
                                <div className="p-3 border-b border-gray-100 bg-pink-50 font-medium text-pink-800">
                                  Paramètres et confidentialité
                                </div>
                                <div className="p-3 hover:bg-gray-50">Enregistrements</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 mt-3">Appuyez sur le menu puis "Paramètres et confidentialité"</span>
                      </div>
                    </div>
                    
                    {/* Étape 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">3</div>
                          <div>
                            <h4 className="font-medium text-pink-800">Sélectionnez "Votre activité"</h4>
                            <p className="text-gray-700 mt-2">Dans le menu des paramètres, cherchez et appuyez sur "Votre activité" pour accéder à vos données et activités.</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <div className="w-[220px] h-[400px] bg-gray-200 rounded-xl border-4 border-pink-100 shadow-lg overflow-hidden relative flex justify-center items-center">
                          {/* Placeholder pour l'image générée du menu Votre activité */}
                          <div className="absolute inset-0 bg-white"></div>
                          <div className="absolute inset-0 flex flex-col">
                            <div className="w-full h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
                              <div className="font-medium text-black">Paramètres</div>
                              <div className="w-8 h-8 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                              </div>
                            </div>
                            <div className="flex-1 bg-white p-4 overflow-y-auto">
                              <div className="mb-4 pb-2 border-b border-gray-100">
                                <div className="text-xs text-gray-500 mb-1">COMPTE</div>
                              </div>
                              <div className="space-y-4">
                                <div className="flex items-center py-2">
                                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-pink-800">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                  </div>
                                  <div className="text-sm">Informations personnelles</div>
                                </div>
                                <div className="flex items-center py-2 bg-pink-50 rounded-md px-2">
                                  <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center mr-3">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-pink-800">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                    </svg>
                                  </div>
                                  <div className="text-sm font-medium text-pink-800">Votre activité</div>
                                  <div className="ml-auto">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-pink-800">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                  </div>
                                </div>
                                <div className="flex items-center py-2">
                                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-pink-800">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                    </svg>
                                  </div>
                                  <div className="text-sm">Confidentialité</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 mt-3">Appuyez sur "Votre activité"</span>
                      </div>
                    </div>
                    
                    {/* Étape 4 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">4</div>
                          <div>
                            <h4 className="font-medium text-pink-800">Appuyez sur "Télécharger vos informations"</h4>
                            <p className="text-gray-700 mt-2">Faites défiler jusqu'à trouver l'option "Télécharger vos informations" et appuyez dessus pour demander une copie de vos données.</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <div className="w-[220px] h-[400px] bg-gray-200 rounded-xl border-4 border-pink-100 shadow-lg overflow-hidden relative flex justify-center items-center">
                          {/* Placeholder pour l'image générée du menu Télécharger informations */}
                          <div className="absolute inset-0 bg-white"></div>
                          <div className="absolute inset-0 flex flex-col">
                            <div className="w-full h-14 bg-white border-b border-gray-200 flex items-center px-4">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 mr-4">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                              </svg>
                              <div className="font-medium text-black">Votre activité</div>
                            </div>
                            <div className="flex-1 bg-white p-4 overflow-y-auto">
                              <div className="space-y-4">
                                <div className="flex items-center py-2">
                                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-pink-800">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                  </div>
                                  <div className="text-sm">Interactions</div>
                                </div>
                                <div className="flex items-center py-2">
                                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-pink-800">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                  </div>
                                  <div className="text-sm">Temps d'activité</div>
                                </div>
                                <div className="flex items-center py-2 bg-pink-50 rounded-md px-2">
                                  <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center mr-3">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-pink-800">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                    </svg>
                                  </div>
                                  <div className="text-sm font-medium text-pink-800">Télécharger vos informations</div>
                                  <div className="ml-auto">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-pink-800">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 mt-3">Appuyez sur "Télécharger vos informations"</span>
                      </div>
                    </div>
                    
                    {/* Étape 5 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">5</div>
                          <div>
                            <h4 className="font-medium text-pink-800">Sélectionnez les données à exporter</h4>
                            <p className="text-gray-700 mt-2">Assurez-vous que l'option "Messages" est cochée et choisissez le format JSON pour une compatibilité optimale avec notre application.</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <div className="w-[220px] h-[400px] bg-gray-200 rounded-xl border-4 border-pink-100 shadow-lg overflow-hidden relative flex justify-center items-center">
                          {/* Placeholder pour l'image générée de sélection données */}
                          <div className="absolute inset-0 bg-white"></div>
                          <div className="absolute inset-0 flex flex-col">
                            <div className="w-full h-14 bg-white border-b border-gray-200 flex items-center px-4">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 mr-4">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                              </svg>
                              <div className="font-medium text-black">Sélectionner les informations</div>
                            </div>
                            <div className="flex-1 bg-white p-4 overflow-y-auto">
                              <p className="text-sm text-gray-600 mb-4">Sélectionnez les types de données à inclure dans votre téléchargement:</p>
                              <div className="space-y-3">
                                <div className="flex items-center py-2">
                                  <input type="checkbox" className="mr-3 h-4 w-4 accent-pink-500" />
                                  <div className="text-sm">Publications</div>
                                </div>
                                <div className="flex items-center py-2">
                                  <input type="checkbox" className="mr-3 h-4 w-4 accent-pink-500" />
                                  <div className="text-sm">Stories</div>
                                </div>
                                <div className="flex items-center py-2">
                                  <input type="checkbox" checked className="mr-3 h-4 w-4 accent-pink-500" />
                                  <div className="text-sm font-medium text-pink-800">Messages</div>
                                </div>
                                <div className="flex items-center py-2">
                                  <input type="checkbox" className="mr-3 h-4 w-4 accent-pink-500" />
                                  <div className="text-sm">Commentaires</div>
                                </div>
                                <div className="mt-4 pt-2 border-t border-gray-200">
                                  <div className="text-sm font-medium mb-2">Format:</div>
                                  <select className="w-full p-2 border rounded-md text-sm bg-white">
                                    <option selected>JSON</option>
                                    <option>HTML</option>
                                  </select>
                                </div>
                                <div className="mt-6 py-2 flex justify-center">
                                  <button className="bg-pink-500 text-white py-2 px-4 rounded-md text-sm font-medium">
                                    Soumettre la demande
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 mt-3">Cochez uniquement "Messages" et sélectionnez JSON</span>
                      </div>
                    </div>
                    
                    {/* Étape 6 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">6</div>
                          <div>
                            <h4 className="font-medium text-pink-800">Téléchargez et importez vos données</h4>
                            <p className="text-gray-700 mt-2">Une fois la demande traitée par Instagram (cela peut prendre jusqu'à 48 heures), vous recevrez une notification pour télécharger vos données. Téléchargez le fichier ZIP, puis importez-le dans notre application.</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <div className="w-[220px] h-[220px] bg-gray-200 rounded-xl border-4 border-pink-100 shadow-lg overflow-hidden relative flex justify-center items-center">
                          {/* Placeholder pour l'image générée de téléchargement */}
                          <div className="absolute inset-0 bg-gradient-to-b from-pink-50 to-white"></div>
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-pink-500">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                              </svg>
                            </div>
                            <div className="font-medium text-pink-800 mb-2">Données prêtes!</div>
                            <p className="text-xs text-gray-600 mb-3">instagram_data_20230615.zip</p>
                            <button className="bg-pink-500 hover:bg-pink-600 text-white text-sm py-1 px-4 rounded-md transition-colors">
                              Télécharger
                            </button>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 mt-3">Téléchargez le fichier ZIP contenant vos messages</span>
                      </div>
                    </div>
                    
                    <div className="text-center mt-8">
                      <Button onClick={() => navigate('/designer/upload')} className="bg-pink-500 hover:bg-pink-600">
                        Continuer avec Instagram
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <p className="text-sm text-gray-500 mt-3">
                        Une fois votre fichier prêt, vous pourrez créer votre livre de souvenirs
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="facebook" className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <h3 className="text-xl font-semibold text-blue-700 mb-6">
                    Transformez vos conversations Facebook en souvenirs imprimés
                  </h3>
                  
                  <p className="mb-4">
                    Retrouvez ces moments de partage sur Messenger et donnez-leur une seconde vie dans un livre 
                    personnalisé. Quelques clics suffisent pour créer un souvenir durable et unique !
                  </p>
                  
                  <div className="space-y-8 mt-8">
                    {/* Étape 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">1</div>
                          <div>
                            <h4 className="font-medium text-blue-800">Connectez-vous à Facebook</h4>
                            <p className="text-gray-700 mt-2">Ouvrez Facebook dans un navigateur web sur votre ordinateur et connectez-vous à votre compte avec vos identifiants habituels.</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <div className="w-[300px] h-[200px] bg-gray-200 rounded-xl border-4 border-blue-100 shadow-lg overflow-hidden relative">
                          {/* Placeholder pour l'image générée de connexion Facebook */}
                          <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-700"></div>
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                            <svg viewBox="0 0 24 24" fill="white" className="w-16 h-16 mb-4">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            <div className="bg-white p-4 rounded-lg w-full max-w-xs shadow-md">
                              <div className="flex flex-col space-y-3">
                                <input type="text" placeholder="Email ou téléphone" className="p-2 border border-gray-300 rounded text-sm" />
                                <input type="password" placeholder="Mot de passe" className="p-2 border border-gray-300 rounded text-sm" />
                                <button className="bg-blue-500 text-white p-2 rounded font-medium text-sm">
                                  Se connecter
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 mt-3">Connectez-vous à votre compte Facebook</span>
                      </div>
                    </div>
                    
                    {/* Étape 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">2</div>
                          <div>
                            <h4 className="font-medium text-blue-800">Accédez aux paramètres</h4>
                            <p className="text-gray-700 mt-2">Cliquez sur la flèche vers le bas (▼) en haut à droite de l'écran, puis sélectionnez "Paramètres et confidentialité" dans le menu déroulant.</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <div className="w-[300px] h-[200px] bg-gray-200 rounded-xl border-4 border-blue-100 shadow-lg overflow-hidden relative">
                          {/* Placeholder pour l'image générée des paramètres Facebook */}
                          <div className="absolute inset-0 bg-white"></div>
                          <div className="absolute inset-0 flex flex-col">
                            <div className="w-full h-14 bg-blue-600 flex items-center px-4">
                              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-2">
                                <svg viewBox="0 0 24 24" fill="#1877F2" className="w-6 h-6">
                                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                              </div>
                              <div className="flex-1"></div>
                              <div className="flex space-x-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center relative animate-pulse">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-gray-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                  </svg>
                                  
                                  {/* Menu déroulant */}
                                  <div className="absolute top-full right-0 mt-2 w-64 bg-white shadow-xl rounded-lg overflow-hidden z-10">
                                    <div className="p-3 border-b border-gray-100 hover:bg-gray-50">Votre profil</div>
                                    <div className="p-3 border-b border-gray-100 bg-blue-50 font-medium text-blue-800">
                                      Paramètres et confidentialité
                                    </div>
                                    <div className="p-3 hover:bg-gray-50">Se déconnecter</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 mt-3">Cliquez sur le menu et "Paramètres et confidentialité"</span>
                      </div>
                    </div>
                    
                    {/* Étape 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">3</div>
                          <div>
                            <h4 className="font-medium text-blue-800">Sélectionnez "Vos informations Facebook"</h4>
                            <p className="text-gray-700 mt-2">Dans le menu de gauche, cliquez sur "Vos informations Facebook" pour accéder aux options d'exportation de vos données.</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <div className="w-[300px] h-[200px] bg-gray-200 rounded-xl border-4 border-blue-100 shadow-lg overflow-hidden relative">
                          {/* Placeholder pour l'image générée de la page Vos informations Facebook */}
                          <div className="absolute inset-0 bg-gray-50"></div>
                          <div className="absolute inset-0 flex">
                            <div className="w-1/3 h-full bg-white border-r border-gray-200 p-2">
                              <div className="font-medium mb-2 text-sm text-gray-800">Paramètres</div>
                              <div className="space-y-1">
                                <div className="p-2 rounded text-sm">Général</div>
                                <div className="p-2 rounded text-sm">Sécurité</div>
                                <div className="p-2 rounded bg-blue-100 text-blue-800 font-medium text-sm">Vos informations Facebook</div>
                                <div className="p-2 rounded text-sm">Confidentialité</div>
                                <div className="p-2 rounded text-sm">Applications</div>
                              </div>
                            </div>
                            <div className="w-2/3 h-full p-4">
                              <h3 className="font-medium mb-3 text-blue-800">Vos informations Facebook</h3>
                              <p className="text-xs text-gray-600 mb-3">Accédez à vos informations ou téléchargez-les</p>
                              <div className="bg-white p-3 rounded border border-gray-200 shadow-sm">
                                <div className="font-medium text-sm">Télécharger vos informations</div>
                                <p className="text-xs text-gray-600 mt-1">Obtenez une copie de vos données Facebook</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 mt-3">Cliquez sur "Vos informations Facebook"</span>
                      </div>
                    </div>
                    
                    {/* Étape 4 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">4</div>
                          <div>
                            <h4 className="font-medium text-blue-800">Sélectionnez "Messages" uniquement</h4>
                            <p className="text-gray-700 mt-2">Dans la section des données à télécharger, décochez tout sauf "Messages". Choisissez le format JSON et une plage de dates si nécessaire.</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <div className="w-[300px] h-[250px] bg-gray-200 rounded-xl border-4 border-blue-100 shadow-lg overflow-hidden relative">
                          {/* Placeholder pour l'image générée de sélection des données */}
                          <div className="absolute inset-0 bg-white"></div>
                          <div className="absolute inset-0 flex flex-col p-4">
                            <h3 className="font-medium mb-3 text-blue-800">Télécharger vos informations</h3>
                            <p className="text-xs text-gray-600 mb-3">Sélectionnez les types de données que vous souhaitez inclure</p>
                            <div className="flex-1 overflow-y-auto space-y-2">
                              <div className="flex items-center">
                                <input type="checkbox" className="mr-2 h-4 w-4 accent-blue-500" />
                                <span className="text-sm">Publications</span>
                              </div>
                              <div className="flex items-center">
                                <input type="checkbox" className="mr-2 h-4 w-4 accent-blue-500" />
                                <span className="text-sm">Photos et vidéos</span>
                              </div>
                              <div className="flex items-center">
                                <input type="checkbox" checked className="mr-2 h-4 w-4 accent-blue-500" />
                                <span className="text-sm font-medium text-blue-800">Messages</span>
                              </div>
                              <div className="flex items-center">
                                <input type="checkbox" className="mr-2 h-4 w-4 accent-blue-500" />
                                <span className="text-sm">Commentaires</span>
                              </div>
                              <div className="flex items-center">
                                <input type="checkbox" className="mr-2 h-4 w-4 accent-blue-500" />
                                <span className="text-sm">Likes et réactions</span>
                              </div>
                              
                              <div className="mt-4 pt-2 border-t border-gray-200">
                                <div className="text-sm font-medium mb-2">Format:</div>
                                <select className="w-full p-1 text-sm border rounded">
                                  <option selected>JSON</option>
                                  <option>HTML</option>
                                </select>
                                
                                <button className="mt-4 bg-blue-500 text-white py-1 px-3 rounded text-sm font-medium">
                                  Créer le fichier
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 mt-3">Sélectionnez uniquement "Messages" et le format JSON</span>
                      </div>
                    </div>
                    
                    {/* Étape 5 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">5</div>
                          <div>
                            <h4 className="font-medium text-blue-800">Téléchargez vos données</h4>
                            <p className="text-gray-700 mt-2">Quand Facebook aura préparé votre fichier (cela peut prendre quelques minutes à quelques heures), vous recevrez une notification. Cliquez sur "Disponible" puis sur "Télécharger" pour récupérer votre fichier ZIP.</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <div className="w-[300px] h-[200px] bg-gray-200 rounded-xl border-4 border-blue-100 shadow-lg overflow-hidden relative">
                          {/* Placeholder pour l'image générée de téléchargement */}
                          <div className="absolute inset-0 bg-gray-50"></div>
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-blue-500">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                              </svg>
                            </div>
                            <div className="font-medium text-blue-800 mb-2">Vos données sont prêtes!</div>
                            <p className="text-xs text-gray-600 mb-3">facebook_messages_20230615.zip</p>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-4 rounded transition-colors">
                              Télécharger (25 Mo)
                            </button>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 mt-3">Téléchargez votre fichier de messages</span>
                      </div>
                    </div>
                    
                    <div className="text-center mt-8">
                      <Button onClick={() => navigate('/designer/upload')} className="bg-blue-500 hover:bg-blue-600">
                        Continuer avec Facebook
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <p className="text-sm text-gray-500 mt-3">
                        Une fois votre fichier prêt, vous pourrez créer votre livre de souvenirs
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="whatsapp" className="space-y-6">
                <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                  <h3 className="text-xl font-semibold text-green-700 mb-6">
                    Immortalisez vos conversations WhatsApp dans un livre
                  </h3>
                  
                  <p className="mb-4">
                    Ces messages WhatsApp quotidiens contiennent tant de souvenirs ! Transformez-les en un livre 
                    physique que vous pourrez feuilleter pendant des années. Offrez un cadeau original et personnel.
                  </p>
                  
                  <div className="space-y-8 mt-8">
                    {/* Étape 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">1</div>
                          <div>
                            <h4 className="font-medium text-green-800">Ouvrez WhatsApp</h4>
                            <p className="text-gray-700 mt-2">Lancez l'application WhatsApp sur votre téléphone et assurez-vous d'être connecté à votre compte.</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <div className="w-[220px] h-[400px] bg-gray-200 rounded-xl border-4 border-green-100 shadow-lg overflow-hidden relative">
                          {/* Placeholder pour l'image générée de WhatsApp */}
                          <div className="absolute inset-0 bg-gradient-to-b from-green-600 to-green-700 opacity-30"></div>
                          <div className="absolute inset-0 flex flex-col">
                            <div className="w-full h-16 bg-green-600 flex items-center px-4">
                              <div className="text-white font-medium text-lg">WhatsApp</div>
                              <div className="ml-auto flex space-x-4">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-white">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-white">
                                  <circle cx="12" cy="12" r="1"></circle>
                                  <circle cx="19" cy="12" r="1"></circle>
                                  <circle cx="5" cy="12" r="1"></circle>
                                </svg>
                              </div>
                            </div>
                            <div className="w-full bg-green-500 text-white flex p-2 text-sm">
                              <div className="flex-1 font-medium flex space-x-3 justify-center">
                                <span className="opacity-70">DISCUSSIONS</span>
                                <span>STATUT</span>
                                <span>APPELS</span>
                              </div>
                            </div>
                            <div className="flex-1 bg-gray-100 overflow-y-auto px-1 py-2">
                              <div className="bg-white p-3 rounded-md mb-1 flex items-center">
                                <div className="w-12 h-12 bg-green-200 rounded-full mr-3 flex-shrink-0"></div>
                                <div className="flex-1">
                                  <div className="font-medium">Sophie</div>
                                  <div className="text-sm text-gray-600">On se voit demain ?</div>
                                </div>
                                <div className="text-xs text-gray-400">16:45</div>
                              </div>
                              <div className="bg-white p-3 rounded-md mb-1 flex items-center">
                                <div className="w-12 h-12 bg-green-200 rounded-full mr-3 flex-shrink-0"></div>
                                <div className="flex-1">
                                  <div className="font-medium">Thomas</div>
                                  <div className="text-sm text-gray-600">Photo reçue</div>
                                </div>
                                <div className="text-xs text-gray-400">Hier</div>
                              </div>
                              <div className="bg-white p-3 rounded-md mb-1 flex items-center">
                                <div className="w-12 h-12 bg-green-200 rounded-full mr-3 flex-shrink-0"></div>
                                <div className="flex-1">
                                  <div className="font-medium">Famille ❤️</div>
                                  <div className="text-sm text-gray-600">Papa: Bonne nuit à tous!</div>
                                </div>
                                <div className="text-xs text-gray-400">Hier</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 mt-3">Ouvrez l'application WhatsApp sur votre téléphone</span>
                      </div>
                    </div>
                    
                    {/* Étape 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">2</div>
                          <div>
                            <h4 className="font-medium text-green-800">Allez dans la conversation</h4>
                            <p className="text-gray-700 mt-2">Ouvrez la conversation que vous souhaitez transformer en livre en la sélectionnant dans la liste de vos discussions.</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <div className="w-[220px] h-[400px] bg-gray-200 rounded-xl border-4 border-green-100 shadow-lg overflow-hidden relative">
                          {/* Placeholder pour l'image générée d'une conversation WhatsApp */}
                          <div className="absolute inset-0 bg-gray-100"></div>
                          <div className="absolute inset-0 flex flex-col">
                            <div className="w-full h-16 bg-green-600 flex items-center p-2">
                              <div className="w-10 h-10 bg-green-300 rounded-full mr-3 flex-shrink-0"></div>
                              <div className="text-white">
                                <div className="font-medium">Sophie</div>
                                <div className="text-xs opacity-80">En ligne</div>
                              </div>
                              <div className="ml-auto flex space-x-4">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-white">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                </svg>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-white">
                                  <circle cx="12" cy="12" r="1"></circle>
                                  <circle cx="19" cy="12" r="1"></circle>
                                  <circle cx="5" cy="12" r="1"></circle>
                                </svg>
                              </div>
                            </div>
                            <div className="flex-1 p-3 overflow-y-auto flex flex-col space-y-2">
                              <div className="bg-white p-2 rounded-lg self-start max-w-[70%]">
                                <p className="text-sm">Salut ! Comment vas-tu ?</p>
                                <span className="text-xs text-gray-400 text-right block">14:32</span>
                              </div>
                              <div className="bg-green-100 p-2 rounded-lg self-end max-w-[70%]">
                                <p className="text-sm">Très bien merci ! Et toi ?</p>
                                <span className="text-xs text-gray-400 text-right block">14:33</span>
                              </div>
                              <div className="bg-white p-2 rounded-lg self-start max-w-[70%]">
                                <p className="text-sm">On se voit demain comme prévu ?</p>
                                <span className="text-xs text-gray-400 text-right block">14:35</span>
                              </div>
                              <div className="bg-green-100 p-2 rounded-lg self-end max-w-[70%]">
                                <p className="text-sm">Oui bien sûr ! À 15h au café</p>
                                <span className="text-xs text-gray-400 text-right block">14:36</span>
                              </div>
                            </div>
                            <div className="w-full h-12 bg-gray-200 px-2 py-1 flex items-center">
                              <div className="flex-1 bg-white rounded-full px-3 py-1 mx-1">
                                <span className="text-gray-400">Message</span>
                              </div>
                              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-white">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 mt-3">Ouvrez la conversation que vous souhaitez exporter</span>
                      </div>
                    </div>
                    
                    {/* Étape 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">3</div>
                          <div>
                            <h4 className="font-medium text-green-800">Appuyez sur le nom du contact</h4>
                            <p className="text-gray-700 mt-2">Dans la conversation, appuyez sur le nom du contact ou du groupe en haut de l'écran pour accéder aux informations et paramètres.</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <div className="w-[220px] h-[400px] bg-gray-200 rounded-xl border-4 border-green-100 shadow-lg overflow-hidden relative">
                          {/* Placeholder pour l'image générée d'appui sur le nom */}
                          <div className="absolute inset-0 bg-gray-100"></div>
                          <div className="absolute inset-0 flex flex-col">
                            <div className="w-full h-16 bg-green-600 flex items-center p-2 animate-pulse">
                              <div className="w-10 h-10 bg-green-300 rounded-full mr-3 flex-shrink-0"></div>
                              <div className="text-white">
                                <div className="font-medium">Sophie</div>
                                <div className="text-xs opacity-80">En ligne</div>
                              </div>
                            </div>
                            <div className="flex-1 bg-white p-4">
                              <div className="flex flex-col items-center py-4">
                                <div className="w-24 h-24 bg-green-200 rounded-full mb-3"></div>
                                <div className="text-green-800 font-medium text-lg">Sophie</div>
                                <div className="text-gray-500 text-sm">+33 6 12 34 56 78</div>
                              </div>
                              
                              <div className="flex justify-around my-4">
                                <div className="flex flex-col items-center">
                                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-1">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-green-800">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                    </svg>
                                  </div>
                                  <span className="text-xs">Appel</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-1">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-green-800">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                    </svg>
                                  </div>
                                  <span className="text-xs">Vidéo</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-1">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-green-800">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                                    </svg>
                                  </div>
                                  <span className="text-xs">Rechercher</span>
                                </div>
                              </div>
                              
                              <div className="my-4">
                                <div className="bg-green-50 p-2 rounded flex items-center">
                                  <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center mr-2">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-green-800">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                                    </svg>
                                  </div>
                                  <div className="text-sm font-medium text-green-800">Exporter la conversation</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 mt-3">Appuyez sur le nom du contact ou du groupe</span>
                      </div>
                    </div>
                    
                    {/* Étape 4 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">4</div>
                          <div>
                            <h4 className="font-medium text-green-800">Sélectionnez "Exporter la conversation"</h4>
                            <p className="text-gray-700 mt-2">Faites défiler vers le bas et appuyez sur l'option "Exporter la conversation" ou "Exporter le chat" selon votre version de WhatsApp.</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <div className="w-[220px] h-[250px] bg-gray-200 rounded-xl border-4 border-green-100 shadow-lg overflow-hidden relative">
                          {/* Placeholder pour l'image générée du menu d'exportation */}
                          <div className="absolute inset-0 bg-white"></div>
                          <div className="absolute inset-0 flex flex-col p-4">
                            <h3 className="font-medium text-center mb-4">Exporter la conversation</h3>
                            
                            <div className="space-y-4">
                              <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                                <p className="text-sm">Inclure les médias ?</p>
                              </div>
                              
                              <div className="flex space-x-2">
                                <button className="flex-1 bg-gray-100 py-2 rounded text-sm font-medium">Sans médias</button>
                                <button className="flex-1 bg-green-500 text-white py-2 rounded text-sm font-medium">Avec médias</button>
                              </div>
                              
                              <div className="text-xs text-gray-500 text-center">
                                L'exportation inclura les messages texte et peut inclure les photos, vidéos et documents partagés.
                              </div>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 mt-3">Choisissez d'inclure ou non les médias</span>
                      </div>
                    </div>
                    
                    {/* Étape 5 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">5</div>
                          <div>
                            <h4 className="font-medium text-green-800">Partagez le fichier d'exportation</h4>
                            <p className="text-gray-700 mt-2">WhatsApp vous proposera différentes options pour partager le fichier d'exportation. Choisissez "Enregistrer dans les fichiers" ou envoyez-le par e-mail pour pouvoir l'utiliser facilement.</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <div className="w-[220px] h-[300px] bg-gray-200 rounded-xl border-4 border-green-100 shadow-lg overflow-hidden relative">
                          {/* Placeholder pour l'image générée du partage de fichier */}
                          <div className="absolute inset-0 bg-gray-100"></div>
                          <div className="absolute inset-0 flex flex-col">
                            <div className="bg-white p-4 rounded-t-xl">
                              <p className="text-center text-sm font-medium">Partager avec</p>
                            </div>
                            <div className="flex-1 p-4 grid grid-cols-3 gap-4">
                              <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-blue-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                  </svg>
                                </div>
                                <span className="text-xs">Email</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-1">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                                  </svg>
                                </div>
                                <span className="text-xs">Partager</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-1">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-green-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                  </svg>
                                </div>
                                <span className="text-xs">Fichiers</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-1">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-purple-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                  </svg>
                                </div>
                                <span className="text-xs">Drive</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-gray-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
                                  </svg>
                                </div>
                                <span className="text-xs">Copier</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 mt-3">Choisissez comment enregistrer le fichier d'exportation</span>
                      </div>
                    </div>
                    
                    <div className="text-center mt-8">
                      <Button onClick={() => navigate('/designer/upload')} className="bg-green-500 hover:bg-green-600">
                        Continuer avec WhatsApp
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <p className="text-sm text-gray-500 mt-3">
                        Une fois votre fichier prêt, vous pourrez créer votre livre de souvenirs
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>

        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-serif font-semibold text-ts-indigo mb-6">Prochaines étapes</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-ts-gold/30 hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-ts-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-ts-gold">1</span>
                </div>
                <h4 className="text-lg font-medium mb-2 text-ts-forest">Personnalisation</h4>
                <p className="text-gray-600">Choisissez le style, les couleurs et la mise en page de votre livre.</p>
              </CardContent>
            </Card>
            
            <Card className="border-ts-gold/30 hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-ts-terracotta/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-ts-terracotta">2</span>
                </div>
                <h4 className="text-lg font-medium mb-2 text-ts-forest">Aperçu</h4>
                <p className="text-gray-600">Visualisez votre livre avant de confirmer votre commande.</p>
              </CardContent>
            </Card>
            
            <Card className="border-ts-gold/30 hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-ts-indigo/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-ts-indigo">3</span>
                </div>
                <h4 className="text-lg font-medium mb-2 text-ts-forest">Commande</h4>
                <p className="text-gray-600">Choisissez votre format et passez commande en quelques clics.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExtractionGuide;

