import React from 'react'

const styles = {
  box: {
    border: '1px solid #DDD',
    margin: 10,
    padding: 10,
    backgroundColor: '#EFEFEF'
  },
  red: {
    color: 'red'
  },
  green: {
    color: 'green'
  }
}

class AnswerBox extends React.Component {
  constructor (...args) {
    super(...args)
    this.state = { answer: null }
  }

  chooseAnswer (e) {
    this.setState({
      answer: e.target.value
    })
  }

  handleSubmit () {
    const { answer } = this.state
    const { onSubmit } = this.props

    if (onSubmit) onSubmit(answer)
  }

  renderPrompt () {
    const { step } = this.props

    return (
      <div style={styles.box}>
        {step.answers.map((answer) => (
          <div key={answer}>
            <input
              type='radio'
              value={answer}
              name='answer'
              onChange={(e) => this.chooseAnswer(e)}
            />
            {answer}
          </div>
        ))}
        <br />
        <button onClick={() => this.handleSubmit()}>Submit</button>
      </div>
    )
  }

  renderStatus () {
    const { step } = this.props
    const isCorrect = step.givenAnswer === step.correctAnswer

    const getSymbol = (answer) => {
      if (answer !== step.givenAnswer) return (<span>*</span>)
      if (isCorrect) return (<span style={styles.green}>✓</span>)
      return (<span style={styles.red}>✘</span>)
    }

    const correctAnswer = (
      <div>
        <br />
        <b>Correct answer is:</b> {step.correctAnswer}
      </div>
    )

    return (
      <div style={styles.box}>
        {step.answers.map((answer) => (
          <div key={answer}>
            {getSymbol(answer)} {answer}
          </div>
        ))}
        {!isCorrect ? correctAnswer : null}
      </div>
    )
  }

  render () {
    const { step, loading } = this.props

    if (loading) return (<p>Loading...</p>)
    if (!step.givenAnswer) return this.renderPrompt()
    return this.renderStatus()
  }
}

AnswerBox.propTypes = {
  step: React.PropTypes.object.isRequired,
  courseId: React.PropTypes.string,
  lessonId: React.PropTypes.string
}

AnswerBox.fragment = (c) => c.createFragment(`
  fragment on Step {
    id,
    answers,
    correctAnswer,
    givenAnswer
  }
`)

export default AnswerBox
