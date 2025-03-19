'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTeams } from '@/hooks/useTeams';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Users, Mail, Phone, ListTodo, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function TeamsList() {
  const router = useRouter();
  const { teams, fetchTeams, createTeam, isLoading, inviteMember } = useTeams();
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [inviteMethod, setInviteMethod] = useState<'email' | 'phone'>('email');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreateTeam = async () => {
    try {
      if (!teamName) {
        toast({
          title: "Error",
          description: "El nombre del equipo es obligatorio",
          variant: "destructive",
        });
        return;
      }
      
      await createTeam({ name: teamName, description: teamDescription });
      setTeamName('');
      setTeamDescription('');
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Éxito",
        description: "Equipo creado correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Error al crear el equipo",
        variant: "destructive",
      });
    }
  };

  const handleInviteMember = async (teamId: number) => {
    try {
      if (inviteMethod === 'email') {
        if (!inviteEmail) {
          toast({
            title: "Error",
            description: "El email es obligatorio",
            variant: "destructive",
          });
          return;
        }
        await inviteMember(teamId, { email: inviteEmail });
        setInviteEmail('');
      } else {
        if (!invitePhone) {
          toast({
            title: "Error",
            description: "El teléfono es obligatorio",
            variant: "destructive",
          });
          return;
        }
        await inviteMember(teamId, { phone: invitePhone });
        setInvitePhone('');
      }
      
      toast({
        title: "Éxito",
        description: "Invitación enviada correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Error al enviar la invitación",
        variant: "destructive",
      });
    }
  };

  const viewTeamMembers = (teamId: number) => {
    router.push(`teams/members/${teamId}`);
  };

  const navigateToTeamTasks = (teamId: number) => {
    router.push(`/tasks?team=${teamId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mis Equipos</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Crear Equipo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear nuevo equipo</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Nombre del equipo"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              <Textarea
                placeholder="Descripción (opcional)"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
              />
              <Button 
                onClick={handleCreateTeam}
                disabled={isLoading}
              >
                {isLoading ? 'Creando...' : 'Crear equipo'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p>Cargando equipos...</p>
      ) : teams.length > 0 ? (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Descripción</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id} className="text-center">
                <td className="border p-2">{team.name}</td>
                <td className="border p-2">{team.description || '-'}</td>
                <td className="border p-2">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewTeamMembers(team.id)}
                    >
                      <Users className="w-4 h-4 mr-1" />
                      Integrantes
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTeamId(team.id)}
                        >
                          <Mail className="w-4 h-4 mr-1" />
                          Invitar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Invitar miembro al equipo</DialogTitle>
                        </DialogHeader>
                        <Tabs defaultValue="email" onValueChange={(v) => setInviteMethod(v as 'email' | 'phone')}>
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="email">Email</TabsTrigger>
                            <TabsTrigger value="phone">Teléfono</TabsTrigger>
                          </TabsList>
                          <TabsContent value="email">
                            <div className="flex flex-col gap-4">
                              <Input
                                type="email"
                                placeholder="Email del nuevo integrante"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                              />
                            </div>
                          </TabsContent>
                          <TabsContent value="phone">
                            <div className="flex flex-col gap-4">
                              <Input
                                type="tel"
                                placeholder="Teléfono del nuevo integrante"
                                value={invitePhone}
                                onChange={(e) => setInvitePhone(e.target.value)}
                              />
                            </div>
                          </TabsContent>
                          <Button 
                            className="mt-4"
                            onClick={() => selectedTeamId && handleInviteMember(selectedTeamId)}
                            disabled={isLoading}
                          >
                            {isLoading ? 'Enviando...' : 'Enviar invitación'}
                          </Button>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tienes equipos aún.</p>
      )}
    </div>
  );
}