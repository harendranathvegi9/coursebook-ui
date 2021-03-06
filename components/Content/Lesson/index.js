import React from 'react'
import StepBar from './StepBar'
import StepNav from '~/containers/Content/Lesson/StepNav'
import AnswerBox from '~/containers/Content/Lesson/AnswerBox'

let Lesson = class extends React.Component {
  renderContent (lesson) {
    const { stepId } = this.props
    if (!stepId) {
      return lesson.intro
    }

    if (!lesson.steps) {
      return (<p>Unathorized Access</p>)
    }

    const step = lesson.steps.find((s) => s.id === stepId)
    if (step.visited) return step.text

    return (<p>'Not Visited Yet!'</p>)
  }

  render () {
    const { course, courseId, lessonId, stepId, allCourses } = this.props
    const lesson = course.lessons[0]
    const step = lesson.steps ? lesson.steps.find((s) => s.id === stepId) : null

    return (
      <div>
        <h2>{lesson.name}</h2>
        <StepBar steps={lesson.steps || []} courseId={courseId} lessonId={lessonId} currentStepId={stepId} />
        <p>
          {this.renderContent(lesson)}
        </p>
        {(step && step.type === 'mcq') ? <AnswerBox courseId={courseId} lessonId={lessonId} step={step} /> : null }
        <StepNav steps={lesson.steps} courseId={courseId} lessonId={lessonId} currentStepId={stepId} allCourses={allCourses} />
      </div>
    )
  }
}

Lesson.propTypes = {
  courseId: React.PropTypes.string.isRequired,
  lessonId: React.PropTypes.string.isRequired,
  stepId: React.PropTypes.string,
  course: React.PropTypes.object.isRequired,
  allCourses: React.PropTypes.array.isRequired
}

Lesson.allCoursesFragment = (c) => c.createFragment(`
  fragment on Course {
    ...${StepNav.courseFragment(c)}
  }
`)

Lesson.courseFragment = (c, props) => {
  const steps = `
    steps {
      ...${StepBar.fragment(c)}
      ...${AnswerBox.fragment(c)}
      type
      text
      visited
    }
  `

  return c.createFragment(`
    fragment on Course {
      id
      lessons(ids: ["${props.lessonId}"]) {
        id
        name
        intro
        ${props.initialState.loginToken ? steps : ''}
      }
    }
  `)
}

export default Lesson
