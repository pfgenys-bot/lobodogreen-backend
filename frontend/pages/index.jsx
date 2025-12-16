import { useEffect, useState } from 'react';
import Tabs from '../src/components/Tabs';
import GameCard from '../src/components/GameCard';
import { fetchLiveGames, fetchTodayGames } from '../src/api';

export default function Home() {
  const [todayGames, setTodayGames] = useState([]);
  const [liveGames, setLiveGames] = useState([]);

  useEffect(() => {
    fetchTodayGames().then(setTodayGames);
    fetchLiveGames().then(setLiveGames);
  }, []);

  return (
    <div>
      <h1>Futebol Ao Vivo</h1>
      <Tabs tabs={['Hoje', 'Ao Vivo']}>
        <div>
          {todayGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
        <div>
          {liveGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </Tabs>
    </div>
  );
}