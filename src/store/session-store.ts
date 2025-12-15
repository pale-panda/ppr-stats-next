import { TrackSessionData } from '@/lib/types/response';

interface State {
  state: TrackSessionData;
  error: string | null;
}

interface Actions {
  type: 'INCREMENT' | 'DECREMENT';
}

function reducer(state: State, action: Actions): State {
  const { type } = action;

  switch (type) {
    case 'INCREMENT':
      return { ...state, state: state.state };
    case 'DECREMENT':
      return { ...state, state: state.state };
    default:
      return state;
  }
}
