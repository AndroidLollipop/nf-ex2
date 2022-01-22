import React from 'react';
import './App.css';
import mockData from './mockData'

enum Scene {
  Mountain = "Mountain",
  Beaches = "Beaches",
  Birds = "Birds",
  Food = "Food"
}

type tabData = {scene: Scene, name: string}
type displayData = {name: string, pictures: Promise<string[]>}

const tabs: tabData[] = [
  {scene: Scene.Mountain, name: "Mountain"},
  {scene: Scene.Beaches, name: "Beaches"},
  {scene: Scene.Birds, name: "Birds"},
  {scene: Scene.Food, name: "Food"}
]

const Tab = (setScene: Function) => ({scene, name}: tabData) => {
  return (
    <button key={scene} className="tab" onClick={() => setScene(scene)}>{name}</button>
  )
}

const useLoader = (pictures: Promise<string[]>) => {
  const [loading, setLoading] = React.useState(true)
  const [pics, setPics] = React.useState([] as string[])
  React.useEffect(() => {
    setLoading(true)
    let cancelled = false
    pictures.then(picURLs => {
      if (cancelled) return
      setLoading(false)
      setPics(picURLs)
    })
    return () => {
      cancelled = true
    }
  }, [pictures])
  return {loading, pics}
}

const Display = ({name, pictures}: displayData) => {
  const {loading, pics} = useLoader(pictures)
  return (
    <div>
      <div className="displayName">{name} Pictures</div>
      {loading ? 
        <div className="imageGridContainer">Loading...</div> : 
        <div className="imageGridContainer">
          {pics.map((pic, index) => 
            <div className="imageContainer">
              <img className="image" key={index} src={pic} alt={name}/>
            </div>
          )}
        </div>
      }
    </div>
  )
}

const App = () => {
  const [scene, setScene] = React.useState(Scene.Mountain)
  const TabMemo = React.useMemo(() => Tab(setScene), [setScene])
  return (
    <div className="App">
      <div className="tabs">
        {tabs.map(TabMemo)}
      </div>
      <Display name={scene} pictures={mockData[scene]}/>
    </div>
  );
}

export default App;
