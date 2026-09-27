import Hero from '@/components/Hero';
import Countdown from '@/components/Countdown';
import Problems from '@/components/Problems';
import HowItWorks from '@/components/HowItWorks';
import Values from '@/components/Values';
import TeamBenefit from '@/components/TeamBenefit';
import PilotInfo from '@/components/PilotInfo';
import ApplyCta from '@/components/ApplyCta';
import Footer from '@/components/Footer';
import MobileCta from '@/components/MobileCta';
import RevealObserver from '@/components/RevealObserver';
import { ToastProvider } from '@/components/Toast';

export default function Home() {
  return (
    <ToastProvider>
      <Hero />
      <Countdown />
      <Problems />
      <HowItWorks />
      <Values />
      <TeamBenefit />
      <PilotInfo />
      <ApplyCta />
      <Footer />
      <MobileCta />
      <RevealObserver />
    </ToastProvider>
  );
}
