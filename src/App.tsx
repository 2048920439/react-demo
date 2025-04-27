import { useBinaryState } from '@/hooks/useBinaryState'

function App() {

  const [state, action] = useBinaryState<number>(0)
  console.log(state)

  return (
    <div onClick={() => action.addState(4)}>test</div>
  )
}

export default App
