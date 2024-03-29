import { Heading, Text } from '@kahzita-ignite-ui/react';
import { Container, HeroContent, HeroImage } from './styles';

import appPreview from '../../assets/app-preview.png';
import Image from 'next/image';
import { ClaimUsernameForm } from './components/ClaimUsernameForm';
import { NextSeo } from 'next-seo';

export default function Home() {
  return (
    <>
      <NextSeo
        title="Descomplique sua agenda | Ignite Call"
        description="Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre."
      />
      <Container>
        <HeroContent>
          <Heading as="h1">Agendamento Descomplicado</Heading>
          <Text size="xl">
            Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre.
          </Text>

          <ClaimUsernameForm />
        </HeroContent>

        <HeroImage>
          <Image
            src={appPreview}
            height={400}
            quality={100}
            alt="Calendário simulando a aplicação em funcionamento"
            priority
          />
        </HeroImage>
      </Container>
    </>
  );
}
