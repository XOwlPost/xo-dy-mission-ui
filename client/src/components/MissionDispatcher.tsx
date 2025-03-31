import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import type { Mission } from '@shared/schema';

const characterOptions = [
  { name: 'Genesis', value: 'genesis' },
  { name: 'VaultBot', value: 'vaultbot' },
  { name: 'XO~Dy', value: 'xody' }
];

export function MissionDispatcher() {
  const [selectedMission, setSelectedMission] = useState<string>('');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');

  // Fetch all missions
  const { data: missions, isLoading } = useQuery<Mission[]>({
    queryKey: ['/api/missions'],
    refetchOnWindowFocus: false
  });
  
  // Make sure missions is always an array
  const missionsList = Array.isArray(missions) ? missions : [];

  // Mutation for dispatch endpoint
  const dispatchMutation = useMutation({
    mutationFn: async (data: { missionCode: string; characterName: string }) => {
      const response = await apiRequest('POST', '/api/dispatch', data);
      return response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: 'Mission Dispatched',
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/mission-steps'] });
    },
    onError: (error) => {
      toast({
        title: 'Dispatch Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMission || !selectedCharacter) {
      toast({
        title: 'Validation Error',
        description: 'Please select both a mission and a character',
        variant: 'destructive'
      });
      return;
    }
    
    dispatchMutation.mutate({
      missionCode: selectedMission,
      characterName: selectedCharacter
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Mission Dispatcher</CardTitle>
        <CardDescription>
          Assign mission steps to a specific character
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mission">Select Mission</Label>
            <Select value={selectedMission} onValueChange={(value) => setSelectedMission(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a mission" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>Loading missions...</SelectItem>
                ) : (
                  missionsList.map((mission: Mission) => (
                    <SelectItem key={mission.code} value={mission.code}>
                      {mission.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="character">Select Character</Label>
            <Select value={selectedCharacter} onValueChange={(value) => setSelectedCharacter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a character" />
              </SelectTrigger>
              <SelectContent>
                {characterOptions.map(character => (
                  <SelectItem key={character.value} value={character.value}>
                    {character.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || dispatchMutation.isPending}
          >
            {dispatchMutation.isPending ? 'Dispatching...' : 'Dispatch Mission'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}