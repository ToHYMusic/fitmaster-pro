import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('📱 PWA готов к работе:', registration.scope)
        
        // Проверяем обновления
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          console.log('🔄 Обновление Service Worker...')
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🆕 Новая версия доступна!')
              // Можно показать уведомление пользователю
            }
          })
        })
      })
      .catch(error => {
        console.log('⚠️ Service Worker не зарегистрирован:', error)
      })
  })
}

// Отслеживаем офлайн/онлайн статус
window.addEventListener('online', () => {
  console.log('🌐 Онлайн режим')
  document.documentElement.classList.remove('offline')
})

window.addEventListener('offline', () => {
  console.log('📴 Офлайн режим')
  document.documentElement.classList.add('offline')
})

// Запуск React
try {
  const root = ReactDOM.createRoot(document.getElementById('root'))
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
  
  // Скрываем лоадер
  const loadingElement = document.getElementById('loading')
  if (loadingElement) {
    setTimeout(() => {
      loadingElement.style.display = 'none'
    }, 1000)
  }
} catch (error) {
  console.error('❌ Ошибка запуска React:', error)
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h1>Ошибка загрузки</h1>
      <p>Перезагрузите страницу или проверьте консоль</p>
      <button onclick="window.location.reload()">Перезагрузить</button>
    </div>
  `
}