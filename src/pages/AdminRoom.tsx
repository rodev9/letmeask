import { useHistory, useParams } from 'react-router-dom'

import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'

import { RoomCode } from '../components/RoomCode'
import { Button } from '../components/Button'
import { Question } from '../components/Question'

import logoImg from '../assets/images/logo.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
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

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    })
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true
    })
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
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted}
              key={question.id}
            >
              {!question.isAnswered && (
                <>
                  <button
                    type="button"
                    onClick={() => handleCheckQuestionAsAnswered(question.id)}
                  >
                    <img src={checkImg} alt="Marcar como respondida" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHighlightQuestion(question.id)}
                  >
                    <img src={answerImg} alt="Destacar" />
                  </button>
                </>
              )}

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
