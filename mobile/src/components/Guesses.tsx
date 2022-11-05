import { useState, useEffect } from "react";
import { useToast, FlatList } from "native-base";

import { api } from "../services/api";
import { Game, GameProps } from "./Game";
import { Loading } from "./Loading";
import { EmptyMyPoolList } from "./EmptyMyPoolList";

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const toats = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [firstTeamPoints, setFirstTeamPoints] = useState('');
  const [secondTeamPoints, setSecondTeamPoints] = useState('');
  const [games, setGames] = useState<GameProps[]>([]);

  async function handleGuessConfirm(gameId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toats.show({
          title: 'Informe o placar do palpite',
          placement: 'top',
          bgColor: 'red.500'
        });
      }
      console.log("teste");

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      })

      toats.show({
        title: 'Palpite realizado com sucesso',
        placement: 'top',
        bgColor: 'green.500'
      });

      fetchGames();
    } catch (error) {
      console.log(error);

      toats.show({
        title: 'Não foi possivel enviar o palpite',
        placement: 'top',
        bgColor: 'red.500'
      });
    }
  }

  async function fetchGames() {
    try {
      setIsLoading(true);
      const response = await api.get(`/pools/${poolId}/games`);

      setGames(response.data.games);
    } catch (error) {
      console.log(error);

      toats.show({
        title: 'Não foi possivel carregar os jogos',
        placement: 'top',
        bgColor: 'red.500'
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGames();
  }, [poolId])

  if (isLoading) {
    return (
      <Loading />
    );
  }

  return (
    <FlatList
      data={[]}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{ pb: 10 }}
      ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
    />
  );
}
