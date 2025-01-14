import {
	Advanced,
	Alignment,
	BlockDiv,
	Style,
	ConditionalDisplay,
	CustomAttributes,
	CustomCSS,
	EffectsAnimations,
	MarginBottom,
	Responsive,
	Row,
	Transform,
	ContentAlign,
} from '~stackable/block-components'
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()

	attrObject.add( {
		attributes: {
			horizontalScrollerColumnWidth: {
				stkResponsive: true,
				type: 'number',
				default: '',
				stkUnits: 'px',
			},
			horizontalScrollerHeight: {
				type: 'number',
				default: '',
			},
			horizontalScrollerColumnGap: {
				stkResponsive: true,
				type: 'number',
				default: '',
			},
			horizontalScrollerSnap: {
				type: 'string',
				default: '',
			},
			horizontalScrollerLeftOffset: {
				stkResponsive: true,
				type: 'number',
				default: '',
				stkUnits: 'px',
			},
			templateLock: {
				type: 'string',
				default: '',
			},
			columnArrangement: {
				stkResponsive: true,
				type: 'string',
				default: '',
			},

			scrollbarHeight: {
				type: 'number',
				default: '',
			},
			scrollbarTrackColor: {
				type: 'string',
				default: '',
			},
			scrollbarThumbColor: {
				type: 'string',
				default: '',
			},
			scrollbarThumbRadius: {
				type: 'number',
				default: '',
				stkUnits: 'px',
			},
			showScrollbar: {
				type: 'boolean',
				default: false,
			},
		},
		versionAdded: '3.6.4',
		versionDeprecated: '',
	} )

	BlockDiv.addAttributes( attrObject )
	Style.addAttributes( attrObject )
	MarginBottom.addAttributes( attrObject )
	Row.addAttributes( attrObject )
	Alignment.addAttributes( attrObject )
	Advanced.addAttributes( attrObject )
	Transform.addAttributes( attrObject )
	EffectsAnimations.addAttributes( attrObject )
	CustomAttributes.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	ConditionalDisplay.addAttributes( attrObject )
	ContentAlign.addAttributes( attrObject, { columnFit: true } )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
