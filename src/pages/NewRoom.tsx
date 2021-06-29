import { FormEvent, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'

import { Button } from '../components/Button'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'

import '../styles/auth.scss'

export function NewRoom() {
  const { user } = useAuth()
  const history = useHistory()
  const [roomName, setRoomName] = useState('')

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault()

    if (roomName.trim() === '') return

    const roomRef = database.ref('rooms')

    const firebaseRoom = await roomRef.push({
      title: roomName,
      authorId: user?.id
    })

    history.push(`/admin/rooms/${firebaseRoom.key}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração" />
        <strong>Todas as perguntas têm uma resposta</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>

          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              value={roomName}
              onChange={event => setRoomName(event.target.value)}
            />

            <Button type="submit">Criar na sala</Button>
          </form>

          <p>
            Entrar numa sala existente? <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
