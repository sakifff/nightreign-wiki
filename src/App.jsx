import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import SearchModal from './components/SearchModal'
import { useGlobalSearch } from './hooks/useSearch'

import Home from './pages/Home'
import Talismans from './pages/Talismans'
import Relics from './pages/Relics'
import DormantPowers from './pages/DormantPowers'
import Consumables from './pages/Consumables'
import Characters from './pages/Characters'
import CharacterDetail from './pages/CharacterDetail'
import Bosses from './pages/Bosses'
import BossDetail from './pages/BossDetail'
import Builds from './pages/Builds'
import LevelCalculator from './pages/LevelCalculator'
import Changelog from './pages/Changelog'

export default function App() {
  const search = useGlobalSearch()

  return (
    <BrowserRouter>
      <Nav onSearchOpen={() => search.setOpen(true)} />
      <SearchModal {...search} />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/talismans" element={<Talismans />} />
          <Route path="/relics" element={<Relics />} />
          <Route path="/dormant-powers" element={<DormantPowers />} />
          <Route path="/consumables" element={<Consumables />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/characters/:name" element={<CharacterDetail />} />
          <Route path="/bosses" element={<Bosses />} />
          <Route path="/bosses/:name" element={<BossDetail />} />
          <Route path="/builds" element={<Builds />} />
          <Route path="/level-calculator" element={<LevelCalculator />} />
          <Route path="/changelog" element={<Changelog />} />
        </Routes>
      </main>
      <footer className="border-t border-zinc-800 mt-12 py-6 text-center text-xs text-zinc-600">
        Data from the Nightreign Useful Info spreadsheet (v1.03.2 + DLC) by Slay, Unlined-Betters, Emerald Wolf & Penumbra.
        Not affiliated with FromSoftware or Bandai Namco.
      </footer>
    </BrowserRouter>
  )
}
