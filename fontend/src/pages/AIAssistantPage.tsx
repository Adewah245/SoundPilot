import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/shared/PageHeader';
import { DemoBanner } from '@/components/shared/DemoBanner';
import {
  Bot,
  Send,
  Activity,
  Lightbulb,
  ShieldCheck,
  TrendingUp,
  RotateCcw,
  User,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PageId } from '@/lib/navigation';

interface AIAssistantProps {
  onNavigate: (page: PageId) => void;
}

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  suggestions?: string[];
}

const workflowSteps = [
  { icon: Activity, label: 'Measure First', description: 'Capture a baseline before any changes' },
  { icon: Lightbulb, label: 'Understand', description: 'Analyze what the data tells you' },
  { icon: TrendingUp, label: 'Adjust', description: 'Make one controlled change at a time' },
  { icon: RotateCcw, label: 'Measure Again', description: 'Re-measure after the adjustment' },
  { icon: ShieldCheck, label: 'Verify', description: 'Confirm the change improved the result' },
];

const initialMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content:
      "I'm the SoundPilot Assistant. I follow the engineering workflow: Measure first, understand the data, make one controlled change, measure again, then verify. How can I help you with your sound system today?",
    suggestions: [
      'Analyze my latest measurement',
      'I have feedback at 2.4 kHz',
      'My noise floor is too high',
      'Help me verify a change',
    ],
  },
];

// Pre-canned responses based on keywords
function generateResponse(userText: string): { content: string; suggestions?: string[] } {
  const lower = userText.toLowerCase();

  if (lower.includes('feedback') || lower.includes('2.4 khz') || lower.includes('ring')) {
    return {
      content:
        'Feedback at 2.4 kHz indicates a loop between your stage monitor and microphone. Here is the recommended approach:\n\n1. First, measure the current state at the stage monitor position to capture the feedback signature.\n2. Apply a narrow notch filter at 2.4 kHz (-3 dB, Q=5) on the monitor EQ.\n3. Reduce the stage monitor send by 2 dB.\n4. Re-measure to confirm the feedback margin has improved.\n5. Verify the result against your target.\n\nWould you like me to walk you through this step by step?',
      suggestions: ['Walk me through it', 'Open Measurements', 'Show engineering results'],
    };
  }

  if (lower.includes('noise') || lower.includes('hvac')) {
    return {
      content:
        'An elevated noise floor is often caused by HVAC, lighting dimmers, or ground loops. To diagnose:\n\n1. Measure with the HVAC running to capture the current noise floor.\n2. If possible, temporarily turn off the air handling unit and measure again.\n3. Compare the two measurements to confirm the source.\n4. If HVAC is confirmed, consider relocating the measurement microphone or scheduling tuning sessions during HVAC-off windows.\n\nYour current noise floor at FOH Left is -48.5 dBFS, which is 3.5 dB above the -55 dBFS target.',
      suggestions: ['Open Verification', 'Show noise floor trend'],
    };
  }

  if (lower.includes('analyz') || lower.includes('latest') || lower.includes('measurement')) {
    return {
      content:
        'Based on your latest measurement at FOH Center:\n\n- RMS: -18.2 dBFS (within target)\n- Peak: -6.4 dBFS (within target)\n- Distortion: 0.8% (within target)\n- Feedback: 0.0 (no risk)\n\nHowever, the stage monitor position shows issues:\n- THD+N at 3.4% (exceeds 1.0% target)\n- Clipping detected\n- Feedback margin at 0.8 (critical)\n\nI recommend addressing the stage monitor first — that is the most critical finding.',
      suggestions: ['Help me fix the stage monitor', 'Open Engineering', 'Open Measurements'],
    };
  }

  if (lower.includes('verify') || lower.includes('change')) {
    return {
      content:
        'To verify a change, follow the Baseline → Change → Measure → Compare → Verify workflow:\n\n1. Make sure you have a baseline measurement captured before the change.\n2. Make one controlled adjustment (e.g., reduce monitor level by 3 dB).\n3. Re-measure at the same position with the same settings.\n4. Compare before vs. after vs. target.\n5. Accept, request further adjustment, or reject based on whether the after value is within tolerance.\n\nYou can track all of this in the Verification page.',
      suggestions: ['Open Verification', 'Show my verifications'],
    };
  }

  if (lower.includes('walk me') || lower.includes('step by step')) {
    return {
      content:
        'Let us walk through the feedback fix together:\n\nStep 1 — Measure: Go to the Measurements page, select the "Stage Monitor" point, and start a measurement. This captures the current state.\n\nStep 2 — Understand: Look at the distortion and feedback metrics. If THD+N is above 1% and feedback margin is above 0.2, you have a problem.\n\nStep 3 — Adjust: Apply a -3 dB notch at 2.4 kHz (Q=5) on the monitor EQ, and reduce the monitor send by 2 dB.\n\nStep 4 — Measure Again: Re-measure at the same position.\n\nStep 5 — Verify: Compare the before and after values. If THD+N is now below 1.5% and feedback margin is below 0.2, the change is accepted.',
      suggestions: ['Open Measurements', 'Open Verification'],
    };
  }

  return {
    content:
      'I can help you analyze measurements, diagnose issues like feedback or distortion, and guide you through the Measure → Understand → Adjust → Verify workflow. What specifically would you like help with?',
    suggestions: ['Analyze my latest measurement', 'I have feedback at 2.4 kHz', 'My noise floor is too high'],
  };
}

export function AIAssistantPage({ onNavigate }: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(text);
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: response.content,
        suggestions: response.suggestions,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  }

  function handleSuggestionClick(suggestion: string) {
    // Check if suggestion is a navigation action
    if (suggestion === 'Open Measurements') return onNavigate('measurements');
    if (suggestion === 'Open Engineering') return onNavigate('engineering');
    if (suggestion === 'Open Verification') return onNavigate('verification');
    sendMessage(suggestion);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Assistant"
        description="SoundPilot engineering assistant"
        icon={<Bot className="h-5 w-5" />}
      />

      <DemoBanner isDemo message="The assistant uses pre-built guidance patterns. Connect the Go API for AI-powered analysis of live measurement data." />

      {/* Workflow guide */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            The SoundPilot Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between overflow-x-auto gap-1">
            {workflowSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex items-center shrink-0">
                  <div className="flex flex-col items-center gap-1.5 min-w-[90px] text-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-card text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold">{step.label}</p>
                      <p className="text-[9px] text-muted-foreground hidden sm:block max-w-[80px]">{step.description}</p>
                    </div>
                  </div>
                  {i < workflowSteps.length - 1 && (
                    <ArrowRight className="h-3.5 w-3.5 text-primary/30 mx-0.5 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="flex flex-col" style={{ minHeight: '400px' }}>
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm">SoundPilot Assistant</CardTitle>
              <p className="text-xs text-muted-foreground">Online · Engineering guidance mode</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0">
          <div ref={scrollRef} className="h-[350px] overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}
              >
                <div
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border',
                    msg.role === 'assistant'
                      ? 'border-primary/30 bg-primary/10 text-primary'
                      : 'border-border bg-muted text-muted-foreground'
                  )}
                >
                  {msg.role === 'assistant' ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                </div>
                <div className={cn('max-w-[80%]', msg.role === 'user' && 'flex flex-col items-end')}>
                  <div
                    className={cn(
                      'rounded-lg px-3 py-2 text-sm whitespace-pre-wrap',
                      msg.role === 'assistant'
                        ? 'bg-card border border-border'
                        : 'bg-primary/10 border border-primary/20'
                    )}
                  >
                    {msg.content}
                  </div>
                  {msg.suggestions && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.suggestions.map((sug) => (
                        <button
                          key={sug}
                          onClick={() => handleSuggestionClick(sug)}
                          className="rounded-md border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs text-primary hover:bg-primary/10 transition-colors"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="rounded-lg bg-card border border-border px-3 py-2.5">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <Separator />

        {/* Input */}
        <div className="p-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Ask about measurements, feedback, distortion..."
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <Button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              size="icon"
              className="h-9 w-9"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            The assistant guides engineering decisions. It does not control physical equipment.
          </p>
        </div>
      </Card>
    </div>
  );
}
