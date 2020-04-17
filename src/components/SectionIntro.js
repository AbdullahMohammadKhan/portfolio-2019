import React from 'react'
import { Link } from 'gatsby'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { BLOCKS } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import VisibilitySensor from 'react-visibility-sensor'

const SectionIntro = ({ data, animation }) => {
  const animationVisibility = animation && animation.visibility
  const animationDirection = animation && animation.direction

  const { heading, title, body, link } = data

  return (
    <VisibilitySensor partialVisibility={true} delayedCall={true}>
      {({ isVisible }) => {
        const classes = [
          'transition-all',
          'duration-700',
          !isVisible && animationVisibility ? 'opacity-0' : null,
          !isVisible ? getAnimationDirection(animationDirection) : null,
        ]

        return (
          <div className={classes.join(' ')}>
            <SectionPreHeading>{heading}</SectionPreHeading>
            <h2 className="text-3xl text-white mb-6">{title}</h2>
            <div className="text-gray-600">
              <div>
                {documentToReactComponents(body.json, documentRichTextOptions)}
              </div>
              <SectionLink {...link} />
            </div>
          </div>
        )
      }}
    </VisibilitySensor>
  )
}

/**
 * The pre-heading
 * @param {Object} props
 * @param {string} props.children
 */
const SectionPreHeading = ({ children }) => (
  <p className="tracking-wider text-gray-600 font-bold mb-6">
    <FontAwesomeIcon icon={faMinus} className="mr-4" />
    {children}
    <FontAwesomeIcon icon={faMinus} className="ml-4" />
  </p>
)

/**
 * The link component
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.link
 */
const SectionLink = ({ title, link }) => {
  if (!title || !link) {
    return null
  }

  const linkStyle = { transform: link[0] === '#' && 'rotate(90deg)' }
  const getLink = link[0] === '#' ? `${window.location.pathname}/${link}` : link

  return (
    typeof window !== 'undefined' && (
      <Link
        to={getLink}
        className="block text-lg text-white mx-4 mt-8 mb-6 hover:text-green-400 transition duration-200 hover:underline"
      >
        {title}
        <FontAwesomeIcon
          icon={faArrowRight}
          className="ml-6"
          style={linkStyle}
        />
      </Link>
    )
  )
}

/**
 * returns classes controlling animation directions
 * @param {string} direction - a directional indicator defining to/from and a direction. eg: 'to top' or 'from left'
 */
const getAnimationDirection = direction => {
  if (!direction) {
    return null
  }

  // negative margin 'pulls' the container in the specified direction, while the opposite padding fills out the missing space caused by the negative margin
  const mapAnimations = {
    'from top': '-mt-8 pb-8',
    'from bottom': '-mb-8 pt-8',
    'from left': '-ml-8 pr-8',
    'from right': '-mr-8 pl-8',
    'to bottom': '-mt-8 pb-8',
    'to top': '-mb-8 pt-8',
    'to right': '-ml-8 pr-8',
    'to left': '-mr-8 pl-8',
  }

  const margin = mapAnimations[direction.toLowerCase()]

  if (!margin) {
    return null
  }

  return margin
}

//Options adjusting rich text elements
const documentRichTextOptions = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <p className="mb-4">{children}</p>,
  },
}

export default SectionIntro