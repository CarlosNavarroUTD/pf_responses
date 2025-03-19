'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTeams } from '@/hooks/useTeams';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Users, Mail, Phone, LogOut, UserMinus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function TeamMembersPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = Number(params.teamId);
  
  const { 
    members, 
    getTeamMembers, 
    inviteMember, 
    removeMember,
    leaveTeam,
    isLoading 
  } = useTeams();

  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteMethod, setInviteMethod] = useState<'email' | 'phone'>('email');
  const [isOwner, setIsOwner] = useState(false); // TODO: Get this from your auth context or API

  useEffect(() => {
    if (teamId) {
      getTeamMembers(teamId);
      // TODO: Add API call to check if current user is owner
      // setIsOwner(await checkIsOwner(teamId));
    }
  }, [teamId]);

  const handleInviteMember = async () => {
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
        description: error.message || "Error al enviar la invitación",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (userId: number) => {
    try {
      await removeMember(teamId, userId);
      toast({
        title: "Éxito",
        description: "Miembro eliminado correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error al eliminar el miembro",
        variant: "destructive",
      });
    }
  };

  const handleLeaveTeam = async () => {
    try {
      await leaveTeam(teamId);
      toast({
        title: "Éxito",
        description: "Has abandonado el equipo",
      });
      router.push('/teams');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error al abandonar el equipo",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Miembros del Equipo</h2>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Invitar Miembro
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
                  onClick={handleInviteMember}
                  disabled={isLoading}
                >
                  {isLoading ? 'Enviando...' : 'Enviar invitación'}
                </Button>
              </Tabs>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Abandonar Equipo
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Dejarás de tener acceso a todos los recursos del equipo.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleLeaveTeam}>Confirmar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {isLoading ? (
        <p>Cargando miembros...</p>
      ) : members[teamId]?.length > 0 ? (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {members[teamId].map((member) => (
              <tr key={member.id} className="text-center">
                <td className="border p-2">{member.name}</td>
                <td className="border p-2">{member.email}</td>
                <td className="border p-2">
                  {isOwner && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <UserMinus className="w-4 h-4 mr-1" />
                          Expulsar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. El miembro perderá acceso a todos los recursos del equipo.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRemoveMember(member.id)}>
                            Confirmar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay miembros en este equipo.</p>
      )}
    </div>
  );
}