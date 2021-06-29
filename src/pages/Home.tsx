import { FormEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'

import { Button } from '../components/Button'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'

import '../styles/auth.scss'

export function Home() {
  const history = useHistory()
  const { user, signInWithGoogle } = useAuth()
  const [roomCode, setRoomCode] = useState('')

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle()
    }

    history.push('/rooms/new')
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault()

    if (roomCode.trim() === '') return

    const room = await database.ref(`rooms/${roomCode}`).get()

    if (!room.exists()) {
      return alert('Não existe nenhuma sala com este código')
    }

    if (room.val().closedAt) {
      return alert('Esta sala foi fechada')
    }

    history.push(`/rooms/${roomCode}`)
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

          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="" />
            Criar uma sala com o Google
          </button>

          <div className="separator">ou entrar em uma sala</div>

          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Escreve o código da sala"
              value={roomCode}
              onChange={event => setRoomCode(event.target.value)}
            />

            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  )
}
