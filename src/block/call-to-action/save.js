/**
 * Internal dependencies
 */
import { ContainerStyles } from './style'

/**
 * External dependencies
 */
import { version as VERSION } from 'stackable'
import { withVersion } from '~stackable/higher-order'
import classnames from 'classnames'
import {
	BlockDiv,
	ContainerDiv,
	BlockLink,
	getAlignmentClasses,
	CustomCSS,
	getResponsiveClasses,
	Separator,
	getSeparatorClasses,
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
		className,
	} = props

	const blockAlignmentClass = getAlignmentClasses( attributes )
	const separatorClass = getSeparatorClasses( attributes )
	const responsiveClass = getResponsiveClasses( attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-call-to-action',
		responsiveClass,
		separatorClass,
	] )

	const contentClassNames = classnames( [
		'stk-block-call-to-action__content',
	], getContentAlignmentClasses( attributes ) )

	const innnerClassNames = classnames( [
		blockAlignmentClass,
		'stk-block-content',
		'stk-inner-blocks',
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<ContainerStyles.Content version={ props.version } attributes={ attributes } />
			<CustomCSS.Content attributes={ attributes } />
			<Separator.Content attributes={ attributes }>
				<ContainerDiv.Content
					className={ contentClassNames }
					attributes={ attributes }
				>
					<div className={ innnerClassNames }>
						<InnerBlocks.Content />
					</div>
					<BlockLink.Content attributes={ attributes } />
				</ContainerDiv.Content>
			</Separator.Content>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
