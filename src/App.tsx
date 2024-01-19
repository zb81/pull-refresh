import { useEffect, useState } from "react"
import ScrollView from "./ScrollView"

function fetchData() {
  return new Promise<string[]>((resolve) => {
    setTimeout(() => {
      resolve(Array.from({ length: 100 }).map(() => Math.random().toString(32)))
    }, 1000)
  })
}

function App() {
  const [list, setList] = useState<string[]>([])

  async function loadData() {
    const res = await fetchData()
    setList(res)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <>
      <header>Top Nav</header>
      <ScrollView height={window.innerHeight - 50} onRefresh={loadData}>
        {list.map((v, i) => (
          <div key={i}>{v}</div>
        ))}
      </ScrollView>
    </>
  )
}

export default App
