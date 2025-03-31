import { MissionDispatcher } from '@/components/MissionDispatcher';
import { Toaster } from '@/components/ui/toaster';

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">XO~Dy Admin Tools</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Mission Dispatcher</h2>
          <p className="text-gray-600 mb-4">
            Use this tool to assign all steps of a mission to a specific character.
            This is useful for testing mission scenarios with different characters.
          </p>
          <MissionDispatcher />
        </section>
      </div>
      
      <Toaster />
    </div>
  );
}