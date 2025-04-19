import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { EventWithRelations } from "@/lib/types";

export default function EventCard({ event }: { event: EventWithRelations }) {
  return (
    <div className="rounded-3xl overflow-hidden bg-white shadow">
      <div className="relative">
        {event.image_url && (
          <div className="relative bg-black h-60 w-full">
            <Image
              src={event.image_url}
              alt={event.title}
              fill
              className="object-cover opacity-60"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Status badge positioned at top right */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-4 py-2 rounded-xl text-sm font-medium ${
              event.status === "upcoming"
                ? "bg-green-100 text-green-800"
                : event.status === "done"
                ? "bg-gray-100 text-gray-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {event.status === "upcoming"
              ? "Akan Datang"
              : event.status === "done"
              ? "Selesai"
              : "Dibatalkan"}
          </span>
        </div>

        {/* Title overlay on image */}
        <div className="absolute bottom-4 left-2 right-2 p-4bg-opacity-40">
          <h2 className="text-xl font-bold text-white">{event.title}</h2>
        </div>
      </div>

      <div className="p-4">
        {/* Date, Time, Location with icons */}
        <div className="space-y-3 py-2">
          <div className="flex items-center text-slate-500">
            <Calendar className="w-5 h-5 mr-3" color="#2E417A" />
            <span>
              Tanggal:{" "}
              {new Date(event.event_date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center text-slate-500">
            <Clock className="w-5 h-5 mr-3" color="#2E417A" />
            <span>
              Waktu:{" "}
              {new Date(event.event_date).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {event.location && (
            <div className="flex items-center text-slate-500">
              <MapPin className="w-5 h-5 mr-3"color="#2E417A" />
              <span>Lokasi: {event.location}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="mt-3">
            {event.tags.map((tag) => (
              <Link
                href={`/events/tag/${tag.name}`}
                key={tag.id}
                className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-200 mr-2"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Detail button */}
        <Link
          href={`/events/${event.id}`}
          className="w-full mt-4 flex items-center justify-center text-center py-3 bg-[#2E417A] text-white rounded-xl hover:bg-blue-800 transition-colors"
        >
          Lihat detail
          <ArrowRight className="ml-2 h-5 w-5 -rotate-45" />
        </Link>
      </div>
    </div>
  );
}
