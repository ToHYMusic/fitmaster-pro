import { useState, useEffect } from 'react'
import { Database, Wifi, WifiOff, Download } from 'lucide-react'
import './index.css'

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  useEffect(() => {
    // Отслеживаем онлайн статус
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // Проверяем возможность установки PWA
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    })
    
    // Проверяем уже установленное приложение
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('📱 Приложение запущено в standalone режиме (установлено)')
    }
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('✅ Пользователь установил PWA')
      setShowInstallPrompt(false)
    }
    
    setDeferredPrompt(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      {/* Статус бар */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
            <Database size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">FitMaster Pro</h1>
            <p className="text-sm text-purple-300">PWA Фитнес-Трекер</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isOnline ? (
            <div className="flex items-center gap-1 text-green-400">
              <Wifi size={16} />
              <span className="text-sm">Онлайн</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-yellow-400">
              <WifiOff size={16} />
              <span className="text-sm">Офлайн</span>
            </div>
          )}
        </div>
      </div>

      {/* Контент */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-purple-500/30">
          <h2 className="text-3xl font-bold mb-6 text-center">
            🎉 Добро пожаловать в FitMaster Pro!
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-xl p-6">
              <div className="text-4xl mb-3">🏋️‍♂️</div>
              <h3 className="text-xl font-bold mb-2">Трекинг тренировок</h3>
              <p className="text-sm text-purple-200">
                Отслеживайте прогресс, создавайте планы, достигайте целей
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600/30 to-cyan-600/30 rounded-xl p-6">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-bold mb-2">Аналитика прогресса</h3>
              <p className="text-sm text-blue-200">
                Графики, статистика, отчеты о вашем фитнес-пути
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-600/30 to-emerald-600/30 rounded-xl p-6">
              <div className="text-4xl mb-3">🎮</div>
              <h3 className="text-xl font-bold mb-2">Геймификация</h3>
              <p className="text-sm text-green-200">
                Уровни, достижения, квесты для мотивации
              </p>
            </div>
          </div>

          {/* Установка PWA */}
          {showInstallPrompt && (
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-700/50 to-pink-700/50 rounded-xl border border-purple-500/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Download className="text-yellow-300" size={24} />
                  <div>
                    <h4 className="font-bold">Установите приложение!</h4>
                    <p className="text-sm opacity-80">
                      Добавьте на главный экран для быстрого доступа
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleInstallClick}
                  className="px-6 py-2 bg-white text-purple-900 font-bold rounded-lg hover:bg-purple-100 transition-all"
                >
                  Установить
                </button>
              </div>
            </div>
          )}

          {/* Инструкция */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">🚀 Начните прямо сейчас:</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold">1</div>
                <span>Запустите сервер разработки: <code className="bg-black/30 px-2 py-1 rounded">npm run dev</code></span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold">2</div>
                <span>Откройте в браузере: <code className="bg-black/30 px-2 py-1 rounded">http://localhost:5173</code></span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold">3</div>
                <span>На телефоне откройте: <code className="bg-black/30 px-2 py-1 rounded">http://[ваш-IP]:5173</code></span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold">4</div>
                <span>Нажмите "Добавить на главный экран" в меню браузера</span>
              </div>
            </div>
          </div>

          {/* Статус */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">100%</div>
                <div className="text-sm opacity-80">Оффлайн работа</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">7</div>
                <div className="text-sm opacity-80">Создано файлов</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">50+</div>
                <div className="text-sm opacity-80">Всего файлов</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">1</div>
                <div className="text-sm opacity-80">Из 5 этапов</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm opacity-60">
          <p>FitMaster Pro • PWA Фитнес-Трекер • Этап 1/5 завершен</p>
          <p className="mt-1">Продолжение в следующем чате →</p>
        </div>
      </div>
    </div>
  )
}

export default App