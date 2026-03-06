import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, MapPin, ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Room {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  price_online: number;
  price_walkin: number;
  price_daily: number;
  amenities: string[] | null;
}

const timeSlots = Array.from({ length: 13 }, (_, i) => {
  const h = i + 8;
  return `${String(h).padStart(2, "0")}:00`;
});

const Booking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedDate, setSelectedDate] = useState(format(addDays(new Date(), 1), "yyyy-MM-dd"));
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState<{ start_time: string; end_time: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  useEffect(() => {
    supabase.from("rooms").select("*").eq("is_active", true).then(({ data }) => {
      if (data) setRooms(data);
    });
  }, []);

  useEffect(() => {
    if (!selectedRoom || !selectedDate) return;
    supabase
      .from("bookings")
      .select("start_time,end_time")
      .eq("room_id", selectedRoom.id)
      .eq("booking_date", selectedDate)
      .neq("status", "cancelled")
      .then(({ data }) => {
        if (data) setBookedSlots(data);
      });
  }, [selectedRoom, selectedDate]);

  const isSlotBooked = (slot: string) => {
    return bookedSlots.some((b) => slot >= b.start_time && slot < b.end_time);
  };

  const hours = startTime && endTime ? (parseInt(endTime) - parseInt(startTime)) : 0;
  const price = selectedRoom ? hours * selectedRoom.price_online : 0;

  const handleBook = async () => {
    if (!selectedRoom || !startTime || !endTime) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("bookings").insert({
        room_id: selectedRoom.id,
        user_id: user?.id || null,
        guest_name: !user ? guestName : null,
        guest_email: !user ? guestEmail : null,
        booking_date: selectedDate,
        start_time: `${startTime}:00`,
        end_time: `${endTime}:00`,
        booking_type: "hourly",
        source: "online",
        price,
        status: "confirmed",
      });
      if (error) throw error;
      toast({ title: "Reserva confirmada!", description: `${selectedRoom.name} em ${format(new Date(selectedDate), "dd/MM/yyyy")}` });
      setStartTime("");
      setEndTime("");
    } catch (err: unknown) {
      toast({ title: "Erro", description: err instanceof Error ? err.message : "Erro ao reservar", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = addDays(new Date(), i + 1);
    return { value: format(d, "yyyy-MM-dd"), label: format(d, "dd/MM", { locale: ptBR }), weekday: format(d, "EEE", { locale: ptBR }) };
  });

  return (
    <div className="min-h-screen bg-background grid-bg-subtle">
      <div className="container py-8 max-w-4xl">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-display font-bold mb-2">
          Agendar <span className="text-gradient-gold">Sala</span>
        </motion.h1>
        <p className="text-muted-foreground mb-8">Reserve online e pague até 25% menos.</p>

        {/* Step 1: Room */}
        <div className="mb-8">
          <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-gold" /> Escolha a sala</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {rooms.map((room) => (
              <button key={room.id} onClick={() => { setSelectedRoom(room); setStartTime(""); setEndTime(""); }}
                className={`glass-card rounded-xl p-5 text-left transition-all ${selectedRoom?.id === room.id ? "border-gold/40 shadow-gold" : "hover:border-gold/20"}`}>
                <h3 className="font-display font-bold mb-1">{room.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{room.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gold font-semibold">R$ {room.price_online}/h online</span>
                  <span className="text-muted-foreground">R$ {room.price_walkin}/h balcão</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Capacidade: {room.capacity} pessoas</p>
              </button>
            ))}
          </div>
        </div>

        {selectedRoom && (
          <>
            {/* Step 2: Date */}
            <div className="mb-8">
              <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-gold" /> Escolha a data</h2>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {dates.map((d) => (
                  <button key={d.value} onClick={() => { setSelectedDate(d.value); setStartTime(""); setEndTime(""); }}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl text-center transition-all ${selectedDate === d.value ? "bg-gold text-primary-foreground" : "glass-card hover:border-gold/20"}`}>
                    <p className="text-xs uppercase">{d.weekday}</p>
                    <p className="text-sm font-bold">{d.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Time */}
            <div className="mb-8">
              <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-gold" /> Horário</h2>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {timeSlots.map((slot) => {
                  const booked = isSlotBooked(slot + ":00");
                  const isStart = startTime === slot;
                  const isInRange = startTime && endTime && slot >= startTime && slot < endTime;
                  return (
                    <button key={slot} disabled={booked}
                      onClick={() => {
                        if (!startTime || endTime) { setStartTime(slot); setEndTime(""); }
                        else if (slot > startTime) setEndTime(slot);
                        else { setStartTime(slot); setEndTime(""); }
                      }}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${booked ? "bg-destructive/20 text-muted-foreground cursor-not-allowed" : isStart ? "bg-gold text-primary-foreground" : isInRange ? "bg-gold/30 text-gold" : "glass-card hover:border-gold/20"}`}>
                      {slot}
                    </button>
                  );
                })}
              </div>
              {startTime && !endTime && <p className="text-sm text-gold mt-2">Selecione o horário de término</p>}
            </div>

            {/* Guest info if not logged in */}
            {!user && (
              <div className="mb-8 glass-card rounded-xl p-5 space-y-3">
                <h2 className="text-lg font-display font-bold">Seus dados</h2>
                <input placeholder="Nome" value={guestName} onChange={(e) => setGuestName(e.target.value)} className="w-full bg-secondary/50 border border-border/50 rounded-lg px-4 py-2.5 text-sm" />
                <input placeholder="E-mail" type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} className="w-full bg-secondary/50 border border-border/50 rounded-lg px-4 py-2.5 text-sm" />
              </div>
            )}

            {/* Summary */}
            {startTime && endTime && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card-gold rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-display font-bold">{selectedRoom.name}</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(selectedDate), "dd/MM/yyyy")} • {startTime} - {endTime} ({hours}h)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-display font-bold text-gradient-gold">R$ {price}</p>
                    <p className="text-xs text-muted-foreground">preço online</p>
                  </div>
                </div>
                <Button variant="gold" size="lg" className="w-full" onClick={handleBook} disabled={loading || (!user && (!guestName || !guestEmail))}>
                  <Check className="w-5 h-5" /> {loading ? "Reservando..." : "Confirmar Reserva"}
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Booking;
