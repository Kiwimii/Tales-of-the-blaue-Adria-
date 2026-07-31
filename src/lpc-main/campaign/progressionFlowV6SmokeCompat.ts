import { campaignMeta, type CampaignMetaState } from './metaStore';
import { MinigameDirector, type MiniGameId } from './minigames';

const query = new URLSearchParams(location.search);
const genericSmoke = query.get('smoke') === '1' && query.get('progression') !== '1';

if (genericSmoke) {
  const prototype = MinigameDirector.prototype as unknown as Record<string, any>;
  const gatedStart = prototype.start as (id: MiniGameId) => void;
  prototype.start = function smokeCompatibleStart(id: MiniGameId): void {
    const internal = campaignMeta as unknown as { state: CampaignMetaState };
    const previousStage = internal.state.questStage;
    const previousBeer = internal.state.firstBeerOpened;
    const previousAllCore = internal.state.flags['all-core-minigames-unlocked'];
    internal.state.questStage = 'complete';
    internal.state.firstBeerOpened = true;
    internal.state.flags['all-core-minigames-unlocked'] = true;
    try {
      gatedStart.call(this, id);
    } finally {
      internal.state.questStage = previousStage;
      internal.state.firstBeerOpened = previousBeer;
      if (previousAllCore === undefined) delete internal.state.flags['all-core-minigames-unlocked'];
      else internal.state.flags['all-core-minigames-unlocked'] = previousAllCore;
    }
  };
}
