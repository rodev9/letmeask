import { FormEvent, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'

import { RoomCode } from '../components/RoomCode'
import { Button } from '../components/Button'
import { Question } from '../components/Question'

import logoImg from '../assets/images/logo.svg'
import { ReactComponent as LikeImg } from '../assets/images/like.svg'

import '../styles/room.scss'

type RoomParams = {
  id: string
}

export function Room() {
  const { user, signInWithGoogle } = useAuth()
  const { id: roomId } = useParams<RoomParams>()
  const { title, questions } = useRoom(roomId)
  const [newQuestion, setNewQuestion] = useState('')

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()

    if (newQuestion.trim() === '') return

    if (!user) return

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswered: false
    }

    await database.ref(`rooms/${roomId}/questions`).push(question)

    setNewQuestion('')
  }

  async function handleLikeQuestion(questionId: string, likeId?: string) {
    if (likeId) {
      await database
        .ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`)
        .remove()
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user?.id
      })
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />

          <RoomCode code={roomId} />
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

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que queres perguntar?"
            value={newQuestion}
            onChange={event => setNewQuestion(event.target.value)}
          />

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt="" />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para fazer uma pergunta,{' '}
                <button type="button" onClick={signInWithGoogle}>
                  faz login
                </button>
                .
              </span>
            )}

            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>

        <div className="question-list">
          {questions.map(question => (
            <Question
              content={question.content}
              author={question.author}
              key={question.id}
            >
              <button
                className={`like-button ${question.likeId ? 'liked' : ''}`}
                type="button"
                aria-label="Gosto"
                onClick={() => handleLikeQuestion(question.id, question.likeId)}
              >
                {question.likeCount >= 1 && <span>{question.likeCount}</span>}
                <LikeImg />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  )
}
