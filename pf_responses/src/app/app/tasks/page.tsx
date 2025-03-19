'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTasks } from '@/hooks/useTasks';
import { useTeams } from '@/hooks/useTeams';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';

interface NewTask {
  title: string;
  description: string;
  team_id: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  due_date: string;
  assigned_to?: string;
}

export default function TasksList() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTask, setNewTask] = useState<NewTask>({
    title: '',
    description: '',
    team_id: '',
    status: 'TODO',
    due_date: '',
    assigned_to: ''
  });

  const searchParams = useSearchParams();
  const { tasks, fetchTasks, createTask, isLoading } = useTasks();
  const { teams, members, getTeamMembers } = useTeams();
  const [teamUsers, setTeamUsers] = useState<any[]>([]);

  const [filters, setFilters] = useState({
    status: searchParams.get('status') || 'all',
    team: searchParams.get('team') || 'all',
    assignedToMe: searchParams.get('assignedToMe') === 'true'
  });

  // Cuando cambia el equipo en el filtro, actualizar los usuarios del equipo
  useEffect(() => {
    if (filters.team !== 'all') {
      getTeamMembers(parseInt(filters.team));
      // También actualizar el equipo en el formulario de nueva tarea
      setNewTask(prev => ({ ...prev, team_id: filters.team }));
    }
  }, [filters.team]);

  // Actualizar usuarios cuando cambian los miembros del equipo
  useEffect(() => {
    if (newTask.team_id && members[parseInt(newTask.team_id)]) {
      setTeamUsers(members[parseInt(newTask.team_id)]);
    }
  }, [newTask.team_id, members]);

  // Al abrir el diálogo, si hay un equipo seleccionado en filtros, usarlo
  useEffect(() => {
    if (isDialogOpen && filters.team !== 'all') {
      setNewTask(prev => ({ ...prev, team_id: filters.team }));
      getTeamMembers(parseInt(filters.team));
    }
  }, [isDialogOpen]);

  const handleTeamSelect = async (value: string) => {
    setNewTask(prev => ({ ...prev, team_id: value, assigned_to: '' }));
    await getTeamMembers(parseInt(value));
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      await createTask({
        title: newTask.title,
        description: newTask.description,
        team: parseInt(newTask.team_id),
        status: newTask.status,
        due_date: newTask.due_date || undefined,
        assigned_to: newTask.assigned_to ? parseInt(newTask.assigned_to) : undefined
      });

      // Reset form and close dialog
      setNewTask({
        title: '',
        description: '',
        team_id: '',
        status: 'TODO',
        due_date: '',
        assigned_to: ''
      });      
      setIsDialogOpen(false);
      
      // Refresh tasks list
      await fetchTasks();
      
      toast({
        title: "Éxito",
        description: "Tarea creada correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al crear la tarea",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'TODO', label: 'Por hacer' },
    { value: 'IN_PROGRESS', label: 'En progreso' },
    { value: 'DONE', label: 'Completado' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tareas</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Crear tarea
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear nueva tarea</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="flex flex-col gap-4 mt-4">
              <Input
                placeholder="Título de la tarea"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              />
              
              <Textarea
                placeholder="Descripción"
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              />
              
              <Select
                value={newTask.status}
                onValueChange={(value) => setNewTask(prev => ({ ...prev, status: value as 'TODO' | 'IN_PROGRESS' | 'DONE' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.filter(option => option.value !== 'all').map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={newTask.team_id}
                onValueChange={handleTeamSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Equipo" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {newTask.team_id && teamUsers.length > 0 && (
                <Select
                  value={newTask.assigned_to}
                  onValueChange={(value) => setNewTask(prev => ({ ...prev, assigned_to: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Asignar a" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamUsers.map(user => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Input
                type="date"
                value={newTask.due_date}
                onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
              />

              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creando...' : 'Crear tarea'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="mb-4 flex gap-4 items-center">
        <Select
          value={filters.status}
          onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.team}
          onValueChange={(value) => setFilters(prev => ({ ...prev, team: value }))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Equipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los equipos</SelectItem>
            {teams.map(team => (
              <SelectItem key={team.id} value={team.id.toString()}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={filters.assignedToMe ? "default" : "outline"}
          onClick={() => setFilters(prev => ({ ...prev, assignedToMe: !prev.assignedToMe }))}
        >
          Mis tareas
        </Button>
      </div>

      {/* Lista de tareas */}
      {isLoading ? (
        <p>Cargando tareas...</p>
      ) : tasks.length > 0 ? (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Título</th>
              <th className="border p-2">Estado</th>
              <th className="border p-2">Equipo</th>
              <th className="border p-2">Fecha límite</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="text-center">
                <td className="border p-2">{task.title}</td>
                <td className="border p-2">{task.status}</td>
                <td className="border p-2">
                  {teams.find(team => team.id === task.team)?.name}
                </td>
                <td className="border p-2">
                  {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Sin fecha'}
                </td>
                <td className="border p-2">
                  {/* Aquí puedes agregar botones para editar, eliminar, etc. */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay tareas que coincidan con los filtros seleccionados.</p>
      )}
    </div>
  );
}