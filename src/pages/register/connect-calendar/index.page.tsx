import { Button, Heading, InputText, MultiStep, Text } from '@kahzita-ignite-ui/react';
import { Container, Header } from '../styles';
import { ArrowRight, Check } from 'phosphor-react';
import { api } from '../../api/axios';
import { AxiosError } from 'axios';
import { AuthError, ConnectCard, ConnectItem } from './styles';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Register() {
  const session = useSession();
  const router = useRouter();

  const hasAuthError = !!router.query.error;
  const isSignedIn = session.status === 'authenticated';

  async function handleConnectCalendar() {
    await signIn('google');
  }

  return (
    <Container>
      <Header>
        <Heading as="h2">Conecte sua agenda!</Heading>
        <Text>
          Conecte o seu calendário para verificar automaticamente as horas ocupadas e os novos eventos à medida em que são agendados.
        </Text>

        <MultiStep size={4} currentStep={2} />

      </Header>
      <ConnectCard>
        <ConnectItem>
          <Text>Google Calendar</Text>
          {isSignedIn ?
            <Button size="sm" disabled><Check /> Conectado</Button>
            :
            <Button variant="secondary" onClick={handleConnectCalendar}>Conectar <ArrowRight /></Button>
          }
        </ConnectItem>

        {hasAuthError && (
          <AuthError size="sm">
            Não foi possível conectar com o Google. Verifique se você habilitou as permissões de acesso ao Google Calendar.
          </AuthError>
        )}

        <Button type="submit" disabled={!isSignedIn}>Próximo Passo <ArrowRight /></Button>
      </ConnectCard>

    </Container>
  );
}