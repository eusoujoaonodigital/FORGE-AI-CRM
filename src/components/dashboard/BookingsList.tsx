import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { Calendar, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  price: number;
  status: string;
  source: string;
  guest_name: string | null;
  room: { name: string } | null;
}

const BookingsList = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { toast } = useToast();

  const fetchBookings = () => {
    if (!user) return;
    supabase.from("bookings").select("*,room:rooms(name)").eq("user_id", user.id).order("booking_date", { ascending: false }).limit(50)
      .then(({ data }) => { if (data) setBookings(data as unknown as Booking[]); });
  };

  useEffect(() => { fetchBookings(); }, [user]);

  const handleCancel = async (id: string) => {
    const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);
    if (error) toast({ title: "Erro ao cancelar", variant: "destructive" });
    else { toast({ title: "Reserva cancelada" }); fetchBookings(); }
  };

  const statusColors: Record<string, string> = {
    confirmed: "bg-lime/10 text-lime",
    cancelled: "bg-destructive/10 text-destructive",
    pending: "bg-yellow-500/10 text-yellow-400",
  };

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tighter mb-6">Minhas <span className="text-gradient-lime">Reservas</span></h2>
      {bookings.length === 0 ? (
        <div className="surface-card rounded-lg p-12 text-center">
          <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Nenhuma reserva encontrada</p>
          <Button variant="lime-outline" size="sm" className="mt-4" onClick={() => window.location.href = "/agendar"}>
            Agendar Sala
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {bookings.map((b) => (
            <div key={b.id} className="surface-card rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-lime/10">
                  <Calendar className="w-4 h-4 text-lime" />
                </div>
                <div>
                  <p className="font-medium text-sm">{b.room?.name} {b.guest_name && <span className="text-muted-foreground">• {b.guest_name}</span>}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {format(new Date(b.booking_date), "dd/MM/yyyy")} • {b.start_time?.slice(0, 5)} - {b.end_time?.slice(0, 5)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[b.status] || "bg-secondary text-foreground"}`}>
                  {b.status}
                </span>
                <span className="text-sm font-medium text-lime">R$ {b.price}</span>
                {b.status === "confirmed" && (
                  <Button variant="ghost" size="sm" onClick={() => handleCancel(b.id)} className="text-destructive hover:text-destructive h-8">
                    <XCircle className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsList;
