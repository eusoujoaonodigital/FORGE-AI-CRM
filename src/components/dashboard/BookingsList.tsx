import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";

interface Booking {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  price: number;
  status: string;
  source: string;
  room: { name: string } | null;
}

const BookingsList = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("bookings")
      .select("*,room:rooms(name)")
      .eq("user_id", user.id)
      .order("booking_date", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) setBookings(data as unknown as Booking[]);
      });
  }, [user]);

  const statusColors: Record<string, string> = {
    confirmed: "bg-green-500/10 text-green-400",
    cancelled: "bg-red-500/10 text-red-400",
    pending: "bg-yellow-500/10 text-yellow-400",
  };

  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-6">Minhas <span className="text-gradient-gold">Reservas</span></h2>
      {bookings.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhuma reserva encontrada</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="glass-card rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-gold/10">
                  <Calendar className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="font-medium text-sm">{b.room?.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {format(new Date(b.booking_date), "dd/MM/yyyy")} • {b.start_time?.slice(0, 5)} - {b.end_time?.slice(0, 5)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[b.status] || "bg-secondary text-foreground"}`}>
                  {b.status}
                </span>
                <span className="text-sm font-medium text-gold">R$ {b.price}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsList;
