/**
 * Internal dependencies
 */
import BlockStyles from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { withVersion } from '~stackable/higher-order'
import { version as VERSION } from 'stackable'
import {
	BlockDiv,
	BlockLink,
	ContainerDiv,
	CustomCSS,
	getAlignmentClasses,
	getResponsiveClasses,
	getContentAlignmentClasses,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { compose } from '@wordpress/compose'

export const Save = props => {
	const {
		attributes,
	} = props

	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const responsiveClass = getResponsiveClasses( props.attributes )

	const blockClassNames = classnames( [
		props.className,
		'stk-block-pricing-box',
		responsiveClass,
	] )

	const contentClassNames = classnames( [
		'stk-block-pricing-box__content',
	], getContentAlignmentClasses( attributes ) )

	const innerClassNames = classnames( [
		'stk-block-content',
		'stk-inner-blocks',
		blockAlignmentClass,
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<BlockStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			<ContainerDiv.Content
				className={ contentClassNames }
				attributes={ attributes }
			>
				<div className={ innerClassNames }>
					<InnerBlocks.Content />
				</div>
				<BlockLink.Content attributes={ attributes } />
			</ContainerDiv.Content>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
