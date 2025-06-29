
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { ShippingAddress } from "@/types/order";

interface ShippingFormProps {
  initialValues?: ShippingAddress;
  initialData?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  onSubmit: (address: ShippingAddress) => void;
  isSubmitting?: boolean;
  isDigitalDelivery?: boolean;
}

const countries = [
  { value: "CI", label: "Côte d'Ivoire" },
  { value: "SN", label: "Sénégal" },
  { value: "BJ", label: "Bénin" },
  { value: "TG", label: "Togo" },
  { value: "ML", label: "Mali" },
  { value: "BF", label: "Burkina Faso" },
  { value: "GH", label: "Ghana" },
  { value: "CM", label: "Cameroun" },
  { value: "NG", label: "Nigeria" },
  { value: "ES", label: "Espagne" },
  { value: "SA", label: "Arabie Saoudite" },
];

const ShippingForm = ({ initialValues, initialData, onSubmit, isSubmitting = false, isDigitalDelivery = false }: ShippingFormProps) => {
  // Use initialData if provided, otherwise use initialValues or default values
  const defaultValues = initialData ? {
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    fullName: `${initialData.firstName} ${initialData.lastName}`.trim(),
    address: initialData.address || "",
    addressLine1: initialData.address || "",
    addressLine2: "",
    city: initialData.city || "",
    state: "",
    postalCode: initialData.postalCode || "",
    country: initialData.country || "Côte d'Ivoire",
    phone: initialData.phone || "",
    email: initialData.email || "",
  } : initialValues || {
    firstName: "",
    lastName: "",
    fullName: "",
    address: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Côte d'Ivoire",
    phone: "",
    email: "",
  };

  const { register, handleSubmit, formState: { errors } } = useForm<ShippingAddress>({
    defaultValues
  });
  
  const [country, setCountry] = useState(defaultValues.country || "Côte d'Ivoire");

  const handleFormSubmit = (data: ShippingAddress) => {
    const shippingData = {
      ...data,
      country,
      // Ensure all fields are populated correctly
      fullName: data.fullName || `${data.firstName} ${data.lastName}`.trim(),
      addressLine1: data.addressLine1 || data.address,
      address: data.address || data.addressLine1
    };
    
    onSubmit(shippingData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Nom complet</Label>
        <Input
          id="fullName"
          placeholder="Prénom Nom"
          {...register("fullName", { 
            required: "Le nom est requis",
            minLength: { value: 3, message: "Le nom doit comporter au moins 3 caractères" }
          })}
          disabled={isSubmitting}
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm">{errors.fullName.message}</p>
        )}
      </div>

      {!isDigitalDelivery && (
        <>
          <div className="space-y-2">
            <Label htmlFor="addressLine1">Adresse</Label>
            <Input
              id="addressLine1"
              placeholder="Numéro et nom de rue"
              {...register("address", { 
                required: "L'adresse est requise" 
              })}
              disabled={isSubmitting}
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine2">Complément d'adresse (facultatif)</Label>
            <Input
              id="addressLine2"
              placeholder="Appartement, suite, etc."
              {...register("addressLine2")}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                placeholder="Ville"
                {...register("city", { 
                  required: "La ville est requise" 
                })}
                disabled={isSubmitting}
              />
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Région / Province</Label>
              <Input
                id="state"
                placeholder="Région ou province"
                {...register("state", { 
                  required: "La région est requise" 
                })}
                disabled={isSubmitting}
              />
              {errors.state && (
                <p className="text-red-500 text-sm">{errors.state.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Code postal</Label>
              <Input
                id="postalCode"
                placeholder="Code postal"
                {...register("postalCode", { 
                  required: "Le code postal est requis" 
                })}
                disabled={isSubmitting}
              />
              {errors.postalCode && (
                <p className="text-red-500 text-sm">{errors.postalCode.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Pays</Label>
              <Select
                value={country}
                onValueChange={setCountry}
                disabled={isSubmitting}
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Sélectionnez un pays" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={country.label}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="votre@email.com"
          {...register("email", { 
            required: "L'email est requis",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Format d'email invalide"
            }
          })}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+225 01 23 45 67"
          {...register("phone", { 
            required: "Le numéro de téléphone est requis",
            pattern: {
              value: /^[+]?[0-9 ]{7,15}$/,
              message: "Format de téléphone invalide"
            }
          })}
          disabled={isSubmitting}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traitement...
            </>
          ) : (
            "Continuer vers le paiement"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ShippingForm;
