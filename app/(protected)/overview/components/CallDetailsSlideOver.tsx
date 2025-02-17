import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  X,
  Phone,
  Clock,
  DollarSign,
  User,
  Mail,
  Hash,
  Star,
  Bot,
  FileText,
  MessageSquare,
  Sparkles,
  Timer,
  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { CallDetailsSlideOverProps } from "@/components/shared/CallHistory/types";
import { ChatTranscript } from "@/components/shared/CallHistory/ChatTranscript";

const MotionCard = motion(Card);

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const slideIn = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3 },
};

type IconType = React.ComponentType<{
  className?: string;
  size?: string | number;
}>;

const InfoItem = ({
  icon: Icon,
  label,
  value,
  color = "blue",
}: {
  icon: IconType;
  label: string;
  value: string;
  color?: string;
}) => (
  <motion.div
    {...slideIn}
    whileHover={{ scale: 1.02 }}
    className={cn(
      "flex items-start gap-3 p-4 rounded-xl",
      `bg-gradient-to-br from-${color}-50/40 to-${color}-50/10 hover:from-${color}-50/50 hover:to-${color}-50/20 transition-all duration-300 border border-${color}-100/20`
    )}
  >
    <div
      className={cn(
        "rounded-xl p-2.5",
        `bg-gradient-to-br from-${color}-100 to-${color}-50 text-${color}-600 shadow-sm`
      )}
    >
      <Icon className="w-4 h-4" />
    </div>
    <div className="flex-1 min-w-0">
      <p className={cn("text-sm font-medium", `text-${color}-700`)}>{label}</p>
      <p className="text-sm text-gray-700 break-words mt-0.5">{value}</p>
    </div>
  </motion.div>
);

const Section = ({
  title,
  children,
  className,
  icon: Icon,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: IconType;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn("space-y-4", className)}
  >
    <div className="flex items-center gap-2 border-b pb-2">
      {Icon && <Icon className="w-5 h-5 text-gray-400" />}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </motion.div>
);

const StatBadge = ({
  label,
  value,
  children,
}: {
  label: string;
  value?: string | number;
  children?: React.ReactNode;
}) => (
  <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100/50 border shadow-sm">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    {value ? (
      <p className="text-lg font-semibold text-gray-900 mt-1">{value}</p>
    ) : (
      children
    )}
  </div>
);

export function CallDetailsSlideOver({
  call,
  open,
  onClose,
}: CallDetailsSlideOverProps) {
  if (!call) return null;

  const getGradeColor = (grade: boolean | null) => {
    switch (grade) {
      case true:
        return "emerald";
      case false:
        return "rose";
      default:
        return "gray";
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={onClose}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                  <Transition.Child
                    as={Fragment}
                    enter="transform transition ease-in-out duration-500"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transform transition ease-in-out duration-500"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                  >
                    <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                      <div className="flex h-full flex-col overflow-y-scroll bg-gradient-to-br from-white to-gray-50/50">
                        {/* Header */}
                        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b px-4 sm:px-6">
                          <div className="flex items-center justify-between py-4">
                            <div className="flex items-center space-x-3">
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex-shrink-0"
                              >
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                                  <span className="text-lg font-semibold text-white">
                                    {call.customerName[0].toUpperCase()}
                                  </span>
                                </div>
                              </motion.div>
                              <div>
                                <Dialog.Title className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                  {call.customerName}
                                </Dialog.Title>
                                <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                  <Timer className="w-3.5 h-3.5" />
                                  {format(new Date(call.date), "PPp")}
                                </p>
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              className="rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                              onClick={onClose}
                            >
                              <X className="h-6 w-6" />
                            </motion.button>
                          </div>

                          {/* Quick Stats */}
                          <div className="grid grid-cols-3 gap-4 py-4">
                            <StatBadge label="Duration" value={call.duration} />
                            <StatBadge
                              label="Cost"
                              value={`$${call.cost.toFixed(2)}`}
                            />
                            <StatBadge label="Grade">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "mt-1.5 font-semibold px-3 py-1 rounded-lg",
                                  `bg-${getGradeColor(
                                    call.grade
                                  )}-50 text-${getGradeColor(
                                    call.grade
                                  )}-700 border-${getGradeColor(
                                    call.grade
                                  )}-200 shadow-sm`
                                )}
                              >
                                {call.grade === true
                                  ? "true"
                                  : call.grade === false
                                  ? "false"
                                  : "N/A"}
                              </Badge>
                            </StatBadge>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 px-4 py-6 sm:px-6 space-y-8">
                          {/* Customer Information */}
                          <Section title="Customer Details" icon={User}>
                            <div className="grid grid-cols-1 gap-4">
                              <InfoItem
                                icon={User}
                                label="Name"
                                value={call.customerName}
                                color="blue"
                              />
                              <InfoItem
                                icon={Mail}
                                label="Email"
                                value={call.customerEmail}
                                color="indigo"
                              />
                              <InfoItem
                                icon={Phone}
                                label="Phone"
                                value={call.customerNumber}
                                color="violet"
                              />
                            </div>
                          </Section>

                          {/* Call Information */}
                          <Section title="Call Details" icon={Phone}>
                            <div className="grid grid-cols-1 gap-4">
                              <InfoItem
                                icon={Clock}
                                label="Duration"
                                value={call.duration}
                                color="emerald"
                              />
                              <InfoItem
                                icon={DollarSign}
                                label="Cost"
                                value={`$${call.cost.toFixed(2)}`}
                                color="green"
                              />
                              <InfoItem
                                icon={Hash}
                                label="Call ID"
                                value={call.id}
                                color="blue"
                              />
                              {call.phone_number_id && (
                                <InfoItem
                                  icon={Phone}
                                  label="Phone Number ID"
                                  value={call.phone_number_id}
                                  color="indigo"
                                />
                              )}
                              {call.ended_reason && (
                                <InfoItem
                                  icon={Hash}
                                  label="Ended Reason"
                                  value={call.ended_reason}
                                  color="rose"
                                />
                              )}
                            </div>
                          </Section>

                          {/* AI Assistant Details */}
                          <Section title="AI Assistant" icon={Sparkles}>
                            <div className="grid grid-cols-1 gap-4">
                              <InfoItem
                                icon={Bot}
                                label="Assistant Name"
                                value={call.assistant_name}
                                color="purple"
                              />
                              <InfoItem
                                icon={Star}
                                label="Model"
                                value={call.assistant_model_model}
                                color="fuchsia"
                              />
                            </div>
                          </Section>

                          {/* Summary & Transcript */}
                          <Section title="Call Content" icon={BarChart3}>
                            <MotionCard
                              {...fadeInUp}
                              className="bg-gradient-to-br from-gray-50 to-white border shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                              <CardContent className="p-4 space-y-6">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-indigo-600">
                                    <MessageSquare className="h-4 w-4" />
                                    <h4 className="font-medium">Summary</h4>
                                  </div>
                                  <div className="bg-indigo-50/50 rounded-lg p-4 border border-indigo-100/50">
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                      {call.summary}
                                    </p>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-indigo-600">
                                    <FileText className="h-4 w-4" />
                                    <h4 className="font-medium">Transcript</h4>
                                  </div>
                                  <div className="max-h-96 overflow-y-auto rounded-lg border bg-gray-50/50 shadow-inner">
                                    <ChatTranscript
                                      transcript={call.transcript}
                                    />
                                  </div>
                                </div>
                              </CardContent>
                            </MotionCard>
                          </Section>
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )}
    </AnimatePresence>
  );
}
