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
import { type BookingConfig, defaultConfig, BOOKING_PAGE_SLUG } from "@/components/dashboard/BookingPageEditor";

interface Room {
  id: string; name: string; description: string | null; capacity: number;
  price_online: number; price_walkin: number; price_daily: number; amenities: string[] | null;
}

const timeSlots = Array.from({ length: 13 }, (_, i) => { const h = i + 8; return `${String(h).padStart(2, "0")}:00`; });

const bgPatternClass: Record<string, string> = { dots: "dot-grid", squares: "grid-bg", noise: "noise-bg" };

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
  const [customField1, setCustomField1] = useState("");
  const [customField2, setCustomField2] = useState("");
  const [cfg, setCfg] = useState<BookingConfig>(defaultConfig);

  useEffect(() => {
    supabase.from("rooms").select("*").eq("is_active", true).then(({ data }) => { if (data) setRooms(data); });
    supabase.from("landing_pages").select("custom_css").eq("slug", BOOKING_PAGE_SLUG).single().then(({ data }) => {
      if (data?.custom_css) { try { setCfg({ ...defaultConfig, ...JSON.parse(data.custom_css) }); } catch {} }
    });
  }, []);

  useEffect(() => {
    if (!selectedRoom || !selectedDate) return;
    supabase.from("bookings").select("start_time,end_time").eq("room_id", selectedRoom.id).eq("booking_date", selectedDate).neq("status", "cancelled")
      .then(({ data }) => { if (data) setBookedSlots(data); });
  }, [selectedRoom, selectedDate]);

  const isSlotBooked = (slot: string) => bookedSlots.some((b) => slot >= b.start_time && slot < b.end_time);
  const hours = startTime && endTime ? (parseInt(endTime) - parseInt(startTime)) : 0;
  const price = selectedRoom ? hours * selectedRoom.price_online : 0;

  const handleBook = async () => {
    if (!selectedRoom || !startTime || !endTime) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("bookings").insert({
        room_id: selectedRoom.id, user_id: user?.id || null,
        guest_name: !user ? guestName : null, guest_email: !user ? guestEmail : null,
        booking_date: selectedDate, start_time: `${startTime}:00`, end_time: `${endTime}:00`,
        booking_type: "hourly", source: "online", price, status: "confirmed",
        notes: [customField1 && cfg.customFieldLabel1 ? `${cfg.customFieldLabel1}: ${customField1}` : "", customField2 && cfg.customFieldLabel2 ? `${cfg.customFieldLabel2}: ${customField2}` : ""].filter(Boolean).join(" | ") || null,
      });
      if (error) throw error;
      toast({ title: cfg.successMessage, description: `${selectedRoom.name} em ${format(new Date(selectedDate), "dd/MM/yyyy")}` });
      setStartTime(""); setEndTime("");
    } catch (err: unknown) {
      toast({ title: "Erro", description: err instanceof Error ? err.message : "Erro ao reservar", variant: "destructive" });
    } finally { setLoading(false); }
  };

  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = addDays(new Date(), i + 1);
    return { value: format(d, "yyyy-MM-dd"), label: format(d, "dd/MM", { locale: ptBR }), weekday: format(d, "EEE", { locale: ptBR }) };
  });

  const patternCls = bgPatternClass[cfg.bgPattern] || "";

  return (
    <div className={`min-h-screen ${patternCls}`} style={{ background: cfg.bgGradient || cfg.bgColor, color: cfg.textColor, fontFamily: cfg.fontFamily }}>
      <div className="container py-8 max-w-4xl">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 opacity-60 hover:opacity-100 mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        {cfg.logoUrl && <img src={cfg.logoUrl} alt={cfg.brandName} className="h-8 mb-6" />}

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="font-bold mb-2 tracking-tighter" style={{ fontSize: `${cfg.headingSize}px` }}>
          {cfg.tagline}
        </motion.h1>
        <p className="opacity-70 mb-8">{cfg.description}</p>

        {/* Step 1: Room */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><MapPin className="w-5 h-5" style={{ color: cfg.accentColor }} /> Escolha a sala</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {rooms.map((room) => (
              <button key={room.id} onClick={() => { setSelectedRoom(room); setStartTime(""); setEndTime(""); }}
                className="rounded-xl p-5 text-left transition-all border"
                style={{ background: cfg.cardBgColor, borderColor: selectedRoom?.id === room.id ? cfg.accentColor : "transparent", color: cfg.textColor }}>
                <h3 className="font-bold mb-1">{room.name}</h3>
                {room.description && <p className="text-xs opacity-60 mb-2">{room.description}</p>}
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-semibold" style={{ color: cfg.accentColor }}>R$ {room.price_online}/h online</span>
                  {cfg.showPriceComparison && <span className="opacity-50">R$ {room.price_walkin}/h balcão</span>}
                </div>
                {cfg.showCapacity && <p className="text-xs opacity-50 mt-1">Capacidade: {room.capacity} pessoas</p>}
                {cfg.showAmenities && room.amenities && room.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {room.amenities.map((a, i) => <span key={i} className="px-2 py-0.5 rounded-full text-[10px] border border-current/20 opacity-60">{a}</span>)}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {selectedRoom && (
          <>
            {/* Step 2: Date */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Calendar className="w-5 h-5" style={{ color: cfg.accentColor }} /> Escolha a data</h2>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {dates.map((d) => (
                  <button key={d.value} onClick={() => { setSelectedDate(d.value); setStartTime(""); setEndTime(""); }}
                    className="flex-shrink-0 px-4 py-3 rounded-xl text-center transition-all border"
                    style={{ background: selectedDate === d.value ? cfg.accentColor : cfg.cardBgColor, color: selectedDate === d.value ? cfg.accentTextColor : cfg.textColor, borderColor: selectedDate === d.value ? cfg.accentColor : "transparent" }}>
                    <p className="text-xs uppercase">{d.weekday}</p>
                    <p className="text-sm font-bold">{d.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Time */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Clock className="w-5 h-5" style={{ color: cfg.accentColor }} /> Horário</h2>
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
                      className="py-2 px-3 rounded-lg text-sm font-medium transition-all border"
                      style={{
                        background: booked ? "rgba(239,68,68,0.1)" : isStart ? cfg.accentColor : isInRange ? `${cfg.accentColor}33` : cfg.cardBgColor,
                        color: booked ? "rgba(255,255,255,0.3)" : isStart ? cfg.accentTextColor : isInRange ? cfg.accentColor : cfg.textColor,
                        borderColor: isStart || isInRange ? cfg.accentColor : "transparent",
                        cursor: booked ? "not-allowed" : "pointer",
                      }}>
                      {slot}
                    </button>
                  );
                })}
              </div>
              {startTime && !endTime && <p className="text-sm mt-2" style={{ color: cfg.accentColor }}>Selecione o horário de término</p>}
            </div>

            {/* Guest info */}
            {cfg.showGuestForm && !user && (
              <div className="mb-8 rounded-xl p-5 space-y-3 border" style={{ background: cfg.cardBgColor, borderColor: `${cfg.accentColor}20` }}>
                <h2 className="text-lg font-bold">Seus dados</h2>
                <input placeholder="Nome" value={guestName} onChange={(e) => setGuestName(e.target.value)} className="w-full rounded-lg px-4 py-2.5 text-sm border" style={{ background: `${cfg.bgColor}`, borderColor: `${cfg.accentColor}20`, color: cfg.textColor }} />
                <input placeholder="E-mail" type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} className="w-full rounded-lg px-4 py-2.5 text-sm border" style={{ background: `${cfg.bgColor}`, borderColor: `${cfg.accentColor}20`, color: cfg.textColor }} />
                {cfg.customFieldEnabled1 && cfg.customFieldLabel1 && (
                  <input placeholder={cfg.customFieldLabel1} value={customField1} onChange={(e) => setCustomField1(e.target.value)} className="w-full rounded-lg px-4 py-2.5 text-sm border" style={{ background: `${cfg.bgColor}`, borderColor: `${cfg.accentColor}20`, color: cfg.textColor }} />
                )}
                {cfg.customFieldEnabled2 && cfg.customFieldLabel2 && (
                  <input placeholder={cfg.customFieldLabel2} value={customField2} onChange={(e) => setCustomField2(e.target.value)} className="w-full rounded-lg px-4 py-2.5 text-sm border" style={{ background: `${cfg.bgColor}`, borderColor: `${cfg.accentColor}20`, color: cfg.textColor }} />
                )}
              </div>
            )}

            {/* Summary */}
            {startTime && endTime && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl p-6 mb-8 border" style={{ background: cfg.cardBgColor, borderColor: `${cfg.accentColor}30` }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-bold">{selectedRoom.name}</p>
                    <p className="text-sm opacity-60">{format(new Date(selectedDate), "dd/MM/yyyy")} • {startTime} - {endTime} ({hours}h)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: cfg.accentColor }}>R$ {price}</p>
                    <p className="text-xs opacity-50">preço online</p>
                  </div>
                </div>
                <button onClick={handleBook} disabled={loading || (!user && (!guestName || !guestEmail))}
                  className="w-full py-3 rounded-lg font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: cfg.accentColor, color: cfg.accentTextColor }}>
                  <Check className="w-5 h-5" /> {loading ? "Reservando..." : cfg.ctaText}
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Booking;
