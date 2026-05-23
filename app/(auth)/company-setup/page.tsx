"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Building2,
  Users,
  CheckSquare,
  ArrowRight,
  Check,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SectorSelector } from "@/components/company/SectorSelector";
import { toast } from "sonner";

const supabase = createClient();

interface CompanyData {
  name: string;
  sector: string;
  logo: string;
}

interface EmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  position: string;
}

interface TaskData {
  title: string;
}

export default function CompanySetupPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Étape 1 - Entreprise
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: "",
    sector: "",
    logo: "",
  });
  const [uploading, setUploading] = useState(false);

  // Étape 2 - Employé
  const [employeeData, setEmployeeData] = useState<EmployeeData>({
    firstName: "",
    lastName: "",
    email: "",
    position: "manager",
  });

  // Étape 3 - Tâche (optionnelle)
  const [taskData, setTaskData] = useState<TaskData>({
    title: "",
  });
  const [skipTask, setSkipTask] = useState(false);

  // Vérifier si l'utilisateur a déjà une entreprise
  useEffect(() => {
    const checkUserAndCompany = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: company } = await supabase
        .from("companies")
        .select("id")
        .eq("owner_id", user.id)
        .single();

      if (company) {
        router.push("/dashboard");
      }
      setLoading(false);
    };

    checkUserAndCompany();
  }, [router]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Vous devez être connecté");
      setUploading(false);
      return;
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("company-logos")
      .upload(filePath, file);

    if (uploadError) {
      toast.error("Erreur lors de l'upload");
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("company-logos").getPublicUrl(filePath);

    setCompanyData({ ...companyData, logo: publicUrl });
    setUploading(false);
    toast.success("Logo téléchargé");
  };

  const handleCreateCompany = async () => {
    if (!companyData.name) {
      toast.error("Nom de l'entreprise requis");
      return;
    }
    if (!companyData.sector) {
      toast.error("Secteur d'activité requis");
      return;
    }

    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Utilisateur non connecté");
      setSaving(false);
      return;
    }

    const { data: company, error } = await supabase
      .from("companies")
      .insert([
        {
          name: companyData.name,
          sector: companyData.sector,
          logo: companyData.logo,
          owner_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      toast.error(error.message);
      setSaving(false);
      return;
    }

    localStorage.setItem("companyId", company.id);
    setStep(2);
    setSaving(false);
  };

  const handleAddEmployee = async () => {
    if (
      !employeeData.firstName ||
      !employeeData.lastName ||
      !employeeData.email
    ) {
      toast.error("Tous les champs sont requis");
      return;
    }

    setSaving(true);
    const companyId = localStorage.getItem("companyId");

    const { error } = await supabase.from("employees").insert([
      {
        company_id: companyId,
        first_name: employeeData.firstName,
        last_name: employeeData.lastName,
        email: employeeData.email,
        position: employeeData.position,
        hire_date: new Date().toISOString().split("T")[0],
        status: "active",
      },
    ]);

    if (error) {
      toast.error(error.message);
      setSaving(false);
      return;
    }

    setStep(3);
    setSaving(false);
  };

  const handleAddTask = async () => {
    if (skipTask || !taskData.title) {
      router.push("/dashboard");
      return;
    }

    setSaving(true);
    const companyId = localStorage.getItem("companyId");

    // Récupérer l'employé créé
    const { data: employee } = await supabase
      .from("employees")
      .select("id")
      .eq("company_id", companyId)
      .eq("email", employeeData.email)
      .single();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("tasks").insert([
      {
        company_id: companyId,
        title: taskData.title,
        assigned_to: employee?.id,
        created_by: user?.id,
        status: "pending",
        priority: "medium",
      },
    ]);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Tâche créée avec succès");
    }

    router.push("/dashboard");
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2C4A6E] border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side - Steps */}
      <div className="hidden lg:flex lg:w-1/3 lg:flex-col lg:justify-center lg:bg-white lg:px-12 lg:border-r lg:border-gray-100">
        <div className="mx-auto max-w-sm">
          <Link href="/" className="inline-block mb-12">
            <span className="text-2xl font-bold text-gray-900">Silva</span>
          </Link>

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  step >= 1
                    ? "border-[#2C4A6E] bg-[#2C4A6E] text-white"
                    : "border-gray-300 text-gray-300"
                }`}
              >
                {step > 1 ? <Check className="h-4 w-4" /> : "1"}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Informations
                </p>
                <p className="text-xs text-gray-400">Votre entreprise</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  step >= 2
                    ? "border-[#2C4A6E] bg-[#2C4A6E] text-white"
                    : "border-gray-300 text-gray-300"
                }`}
              >
                {step > 2 ? <Check className="h-4 w-4" /> : "2"}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Votre équipe
                </p>
                <p className="text-xs text-gray-400">
                  Ajoutez votre premier employé
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  step >= 3
                    ? "border-[#2C4A6E] bg-[#2C4A6E] text-white"
                    : "border-gray-300 text-gray-300"
                }`}
              >
                {step > 3 ? <Check className="h-4 w-4" /> : "3"}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Première tâche
                </p>
                <p className="text-xs text-gray-400">Optionnel</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Forms */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-2/3">
        <div className="w-full max-w-md">
          {/* Étape 1 - Informations entreprise */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Configurez votre entreprise
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Quelques informations pour commencer
                </p>
              </div>

              <div className="space-y-4">
                {/* Logo upload */}
                <div className="flex flex-col items-center lg:items-start">
                  <div className="relative">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                      {companyData.logo ? (
                        <img
                          src={companyData.logo}
                          alt="Logo"
                          className="h-20 w-20 rounded-full object-cover"
                        />
                      ) : (
                        <Building2 className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-[#2C4A6E] p-1.5 text-white hover:bg-[#1E3A5F]">
                      <Upload className="h-3 w-3" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">Logo (optionnel)</p>
                </div>

                <Input
                  label="Nom de l'entreprise"
                  placeholder="Ma Super Entreprise"
                  value={companyData.name}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, name: e.target.value })
                  }
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Secteur d'activité
                  </label>
                  <SectorSelector
                    selected={companyData.sector}
                    onChange={(sector) =>
                      setCompanyData({ ...companyData, sector })
                    }
                  />
                </div>
              </div>

              <Button
                onClick={handleCreateCompany}
                loading={saving}
                className="w-full bg-[#2C4A6E] hover:bg-[#1E3A5F]"
              >
                Continuer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Étape 2 - Premier employé */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Ajoutez votre premier employé
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Vous pourrez en ajouter d'autres plus tard
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Prénom"
                    placeholder="Jean"
                    value={employeeData.firstName}
                    onChange={(e) =>
                      setEmployeeData({
                        ...employeeData,
                        firstName: e.target.value,
                      })
                    }
                  />
                  <Input
                    label="Nom"
                    placeholder="Dupont"
                    value={employeeData.lastName}
                    onChange={(e) =>
                      setEmployeeData({
                        ...employeeData,
                        lastName: e.target.value,
                      })
                    }
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  placeholder="jean@entreprise.com"
                  value={employeeData.email}
                  onChange={(e) =>
                    setEmployeeData({ ...employeeData, email: e.target.value })
                  }
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Poste
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-[#2C4A6E] focus:outline-none focus:ring-1 focus:ring-[#2C4A6E]"
                    value={employeeData.position}
                    onChange={(e) =>
                      setEmployeeData({
                        ...employeeData,
                        position: e.target.value,
                      })
                    }
                  >
                    <option value="manager">Manager</option>
                    <option value="dev">Développeur</option>
                    <option value="designer">Designer</option>
                    <option value="marketing">Marketing</option>
                    <option value="sales">Commercial</option>
                    <option value="hr">Ressources Humaines</option>
                  </select>
                </div>
              </div>

              <Button
                onClick={handleAddEmployee}
                loading={saving}
                className="w-full bg-[#2C4A6E] hover:bg-[#1E3A5F]"
              >
                Continuer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Étape 3 - Première tâche (optionnelle) */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Créez votre première tâche
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Optionnel - Vous pourrez le faire plus tard
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Titre de la tâche"
                  placeholder="Ex: Créer la page d'accueil"
                  value={taskData.title}
                  onChange={(e) => setTaskData({ title: e.target.value })}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddTask}
                  loading={saving}
                  className="flex-1 bg-[#2C4A6E] hover:bg-[#1E3A5F]"
                >
                  Créer la tâche
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSkipTask(true)}
                  className="flex-1"
                >
                  Passer
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
