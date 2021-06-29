import { useHistory, useParams } from 'react-router-dom'

import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'

import { RoomCode } from '../components/RoomCode'
import { Button } from '../components/Button'
import { Question } from '../components/Question'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'

import '../styles/room.scss'

type AdminRoomParams = {
  id: string
}

export function AdminRoom() {
  const history = useHistory()
  const { id: roomId } = useParams<AdminRoomParams>()
  const { title, questions } = useRoom(roomId)

  async function handleEndRoom() {
    if (!confirm('Tens a certeza que queres fechar esta sala?')) return

    await database.ref(`rooms/${roomId}`).update({
      closedAt: new Date()
    })

    history.push('/')
  }

  async function handleDeleteQuestion(questionId: string) {
    if (!confirm('Tens a certeza que queres remover esta pergunta?')) return

    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />

          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Fechar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length >= 1 && (
            <span>
              {questions.length} pergunta{questions.length > 1 && 's'}
            </span>
          )}
        </div>

        <div className="question-list">
          {questions.map(question => (
            <Question
              content={question.content}
              author={question.author}
              key={question.id}
            >
              <button
                type="button"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="Remover" />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  )
}
