/**
 * External dependencies
 */
import {
	AdvancedRangeControl,
	AdvancedToolbarControl,
	FourRangeControl,
	WhenResponsiveScreen,
	PanelAdvancedSettings,
} from '~stackable/components'
import {
	__getValue,
	createAllCombinationAttributes,
	appendImportant,
	appendImportantAll,
} from '~stackable/util'

/**
 * WordPress dependencies
 */
import {
	addFilter, applyFilters, doAction, removeFilter,
} from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'
import deepmerge from 'deepmerge'
import { Fragment } from '@wordpress/element'
import { i18n } from 'stackable'

removeFilter( 'stackable.setAttributes', 'stackable/module/block-spacing' )
addFilter( 'stackable.setAttributes', 'stackable/module/block-spacing', ( attributes, blockProps ) => {
	if ( typeof attributes.align === 'undefined' ) {
		return attributes
	}
	if ( attributes.align === 'full' && blockProps.align !== 'full' ) {
		attributes.marginRight = ''
		attributes.marginLeft = ''
		attributes.tabletMarginRight = ''
		attributes.tabletMarginLeft = ''
		attributes.tabletPaddingRight = ''
		attributes.tabletPaddingLeft = ''
	}
	return attributes
} )

const inspectorControls = ( blockName, options ) => ( output, props ) => {
	const { setAttributes } = props
	const {
		align = false,
		blockInnerWidth = '',

		marginTop = '',
		marginRight = '',
		marginBottom = '',
		marginLeft = '',
		marginUnit = 'px',

		tabletMarginTop = '',
		tabletMarginRight = '',
		tabletMarginBottom = '',
		tabletMarginLeft = '',
		tabletMarginUnit = 'px',

		mobileMarginTop = '',
		mobileMarginRight = '',
		mobileMarginBottom = '',
		mobileMarginLeft = '',
		mobileMarginUnit = 'px',

		paddingTop = '',
		paddingBottom = '',
		paddingUnit = 'px',

		tabletPaddingTop = '',
		tabletPaddingBottom = '',
		tabletPaddingRight = '',
		tabletPaddingLeft = '',
		tabletPaddingUnit = 'px',

		mobilePaddingTop = '',
		mobilePaddingBottom = '',
		mobilePaddingUnit = 'px',

		blockHeight = '',
		blockHeightUnit = 'px',
		tabletBlockHeight = '',
		tabletBlockHeightUnit = 'px',
		mobileBlockHeight = '',
		mobileBlockHeightUnit = 'px',

		blockWidth = '',
		blockWidthUnit = 'px',
		tabletBlockWidth = '',
		tabletBlockWidthUnit = 'px',
		mobileBlockWidth = '',
		mobileBlockWidthUnit = 'px',

		blockHorizontalAlign = '',
		tabletBlockHorizontalAlign = '',
		mobileBlockHorizontalAlign = '',

		blockVerticalAlign = '',
		tabletBlockVerticalAlign = '',
		mobileBlockVerticalAlign = '',
	} = props.attributes

	let {
		paddingRight = '',
		paddingLeft = '',
		mobilePaddingRight = '',
		mobilePaddingLeft = '',
	} = props.attributes

	if ( align === 'full' ) {
		paddingRight = paddingRight === '' ? 35 : paddingRight
		paddingLeft = paddingLeft === '' ? 35 : paddingLeft
		mobilePaddingRight = mobilePaddingRight === '' ? 18 : mobilePaddingRight
		mobilePaddingLeft = mobilePaddingLeft === '' ? 18 : mobilePaddingLeft
	}

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Block Spacing', i18n ) }
				initialOpen={ false }
				className="ugb--help-tip-advanced-block-spacing"
			>
				{ applyFilters( `stackable.${ blockName }.edit.advanced.block-spacing.before`, null, props ) }

				{ options.height && <Fragment>
					<WhenResponsiveScreen>
						<AdvancedRangeControl
							label={ __( 'Min. Block Height', i18n ) }
							units={ [ 'px', 'vh' ] }
							min={ [ 0, 0 ] }
							max={ [ 1000, 100 ] }
							step={ [ 1, 1 ] }
							allowReset={ true }
							value={ blockHeight }
							unit={ blockHeightUnit }
							onChange={ blockHeight => setAttributes( { blockHeight } ) }
							onChangeUnit={ blockHeightUnit => setAttributes( { blockHeightUnit } ) }
							placeholder="0"
							className="ugb--help-tip-advanced-block-height"
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="tablet">
						<AdvancedRangeControl
							label={ __( 'Min. Block Height', i18n ) }
							units={ [ 'px', 'vh' ] }
							min={ [ 0, 0 ] }
							max={ [ 1000, 100 ] }
							step={ [ 1, 1 ] }
							allowReset={ true }
							value={ tabletBlockHeight }
							unit={ tabletBlockHeightUnit }
							onChange={ tabletBlockHeight => setAttributes( { tabletBlockHeight } ) }
							onChangeUnit={ tabletBlockHeightUnit => setAttributes( { tabletBlockHeightUnit } ) }
							className="ugb--help-tip-advanced-block-height"
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="mobile">
						<AdvancedRangeControl
							label={ __( 'Min. Block Height', i18n ) }
							units={ [ 'px', 'vh' ] }
							min={ [ 0, 0 ] }
							max={ [ 1000, 100 ] }
							step={ [ 1, 1 ] }
							allowReset={ true }
							value={ mobileBlockHeight }
							unit={ mobileBlockHeightUnit }
							onChange={ mobileBlockHeight => setAttributes( { mobileBlockHeight } ) }
							onChangeUnit={ mobileBlockHeightUnit => setAttributes( { mobileBlockHeightUnit } ) }
							className="ugb--help-tip-advanced-block-height"
						/>
					</WhenResponsiveScreen>
				</Fragment> }

				{ options.verticalAlign &&
					<Fragment>
						{ blockHeight !== '' &&
							<WhenResponsiveScreen>
								<AdvancedToolbarControl
									label={ __( 'Content Vertical Align', i18n ) }
									controls="flex-vertical"
									value={ blockVerticalAlign }
									onChange={ value => setAttributes( { blockVerticalAlign: blockVerticalAlign !== value ? value : '' } ) }
									className="ugb--help-tip-advanced-block-vertical-align"
								/>
							</WhenResponsiveScreen>
						}
						{ tabletBlockHeight !== '' &&
							<WhenResponsiveScreen screen="tablet">
								<AdvancedToolbarControl
									label={ __( 'Content Vertical Align', i18n ) }
									controls="flex-vertical"
									value={ tabletBlockVerticalAlign }
									onChange={ value => setAttributes( { tabletBlockVerticalAlign: tabletBlockVerticalAlign !== value ? value : '' } ) }
									className="ugb--help-tip-advanced-block-vertical-align"
								/>
							</WhenResponsiveScreen>
						}
						{ mobileBlockHeight !== '' &&
							<WhenResponsiveScreen screen="mobile">
								<AdvancedToolbarControl
									label={ __( 'Content Vertical Align', i18n ) }
									controls="flex-vertical"
									value={ mobileBlockVerticalAlign }
									onChange={ value => setAttributes( { mobileBlockVerticalAlign: mobileBlockVerticalAlign !== value ? value : '' } ) }
									className="ugb--help-tip-advanced-block-vertical-align"
								/>
							</WhenResponsiveScreen>
						}
					</Fragment>
				}

				{ options.width && <Fragment>
					<WhenResponsiveScreen>
						<AdvancedRangeControl
							label={ __( 'Max. Content Width', i18n ) }
							units={ [ 'px', '%' ] }
							min={ [ 0, 0 ] }
							max={ [ 2500, 100 ] }
							step={ [ 1, 1 ] }
							allowReset={ true }
							value={ blockWidth }
							unit={ blockWidthUnit }
							onChange={ blockWidth => setAttributes( { blockWidth } ) }
							onChangeUnit={ blockWidthUnit => setAttributes( { blockWidthUnit } ) }
							placeholder=""
							initialPosition="2500"
							className="ugb--help-tip-advanced-block-content-width"
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="tablet">
						<AdvancedRangeControl
							label={ __( 'Max. Content Width', i18n ) }
							units={ [ 'px', '%' ] }
							min={ [ 0, 0 ] }
							max={ [ 1500, 100 ] }
							step={ [ 1, 1 ] }
							allowReset={ true }
							value={ tabletBlockWidth }
							unit={ tabletBlockWidthUnit }
							onChange={ tabletBlockWidth => setAttributes( { tabletBlockWidth } ) }
							onChangeUnit={ tabletBlockWidthUnit => setAttributes( { tabletBlockWidthUnit } ) }
							className="ugb--help-tip-advanced-block-content-width"
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="mobile">
						<AdvancedRangeControl
							label={ __( 'Max. Content Width', i18n ) }
							units={ [ 'px', '%' ] }
							min={ [ 0, 0 ] }
							max={ [ 1000, 100 ] }
							step={ [ 1, 1 ] }
							allowReset={ true }
							value={ mobileBlockWidth }
							unit={ mobileBlockWidthUnit }
							onChange={ mobileBlockWidth => setAttributes( { mobileBlockWidth } ) }
							onChangeUnit={ mobileBlockWidthUnit => setAttributes( { mobileBlockWidthUnit } ) }
							className="ugb--help-tip-advanced-block-content-width"
						/>
					</WhenResponsiveScreen>
				</Fragment> }

				{ ( options.horizontalAlign || ( blockInnerWidth !== '' && blockInnerWidth !== 'full' ) ) &&
					<Fragment>
						{ ( blockWidth !== '' || ( blockInnerWidth !== '' && blockInnerWidth !== 'full' ) ) &&
							<WhenResponsiveScreen>
								<AdvancedToolbarControl
									label={ __( 'Content Horizontal Align', i18n ) }
									controls="flex-horizontal"
									value={ blockHorizontalAlign }
									onChange={ value => setAttributes( { blockHorizontalAlign: blockHorizontalAlign !== value ? value : '' } ) }
									className="ugb--help-tip-advanced-block-horizontal-align"
								/>
							</WhenResponsiveScreen>
						}
						{ ( tabletBlockWidth !== '' || ( blockInnerWidth !== '' && blockInnerWidth !== 'full' ) ) &&
							<WhenResponsiveScreen screen="tablet">
								<AdvancedToolbarControl
									label={ __( 'Content Horizontal Align', i18n ) }
									controls="flex-horizontal"
									value={ tabletBlockHorizontalAlign }
									onChange={ value => setAttributes( { tabletBlockHorizontalAlign: tabletBlockHorizontalAlign !== value ? value : '' } ) }
									className="ugb--help-tip-advanced-block-horizontal-align"
								/>
							</WhenResponsiveScreen>
						}
						{ ( mobileBlockWidth !== '' || ( blockInnerWidth !== '' && blockInnerWidth !== 'full' ) ) &&
							<WhenResponsiveScreen screen="mobile">
								<AdvancedToolbarControl
									label={ __( 'Content Horizontal Align', i18n ) }
									controls="flex-horizontal"
									value={ mobileBlockHorizontalAlign }
									onChange={ value => setAttributes( { mobileBlockHorizontalAlign: mobileBlockHorizontalAlign !== value ? value : '' } ) }
									className="ugb--help-tip-advanced-block-horizontal-align"
								/>
							</WhenResponsiveScreen>
						}
					</Fragment>
				}

				{ options.margins && <Fragment>
					<WhenResponsiveScreen screen="desktop">
						<FourRangeControl
							label={ __( 'Block Margins', i18n ) }
							units={ options.marginUnits }
							screens={ [ 'desktop', 'tablet', 'mobile' ] }
							defaultLocked={ false }
							top={ marginTop }
							bottom={ marginBottom }
							right={ marginRight }
							left={ marginLeft }
							unit={ marginUnit }
							min={ [ -500, -100 ] }
							max={ [ 500, 100 ] }
							onChange={ margins => {
								setAttributes( {
									marginTop: ! margins.top && margins.top !== 0 ? '' : parseInt( margins.top, 10 ),
									marginRight: ! margins.right && margins.right !== 0 ? '' : parseInt( margins.right, 10 ),
									marginBottom: ! margins.bottom && margins.bottom !== 0 ? '' : parseInt( margins.bottom, 10 ),
									marginLeft: ! margins.left && margins.left !== 0 ? '' : parseInt( margins.left, 10 ),
								} )
							} }
							onChangeUnit={ marginUnit => setAttributes( { marginUnit } ) }
							enableTop={ options.enableMarginTop }
							enableRight={ align !== 'full' && options.enableMarginRight }
							enableBottom={ options.enableMarginBottom }
							enableLeft={ align !== 'full' && options.enableMarginLeft }
							placeholder="0"
							placeholderBottom="35"
							className="ugb--help-tip-advanced-block-margins"
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="tablet">
						<FourRangeControl
							label={ __( 'Block Margins', i18n ) }
							units={ options.marginUnits }
							screens={ [ 'desktop', 'tablet', 'mobile' ] }
							defaultLocked={ false }
							top={ tabletMarginTop }
							bottom={ tabletMarginBottom }
							right={ tabletMarginRight }
							left={ tabletMarginLeft }
							unit={ tabletMarginUnit }
							min={ [ -500, -100 ] }
							max={ [ 500, 100 ] }
							onChange={ margins => {
								setAttributes( {
									tabletMarginTop: ! margins.top && margins.top !== 0 ? '' : parseInt( margins.top, 10 ),
									tabletMarginRight: ! margins.right && margins.right !== 0 ? '' : parseInt( margins.right, 10 ),
									tabletMarginBottom: ! margins.bottom && margins.bottom !== 0 ? '' : parseInt( margins.bottom, 10 ),
									tabletMarginLeft: ! margins.left && margins.left !== 0 ? '' : parseInt( margins.left, 10 ),
								} )
							} }
							onChangeUnit={ tabletMarginUnit => setAttributes( { tabletMarginUnit } ) }
							enableTop={ options.enableMarginTop }
							enableRight={ align !== 'full' && options.enableMarginRight }
							enableBottom={ options.enableMarginBottom }
							enableLeft={ align !== 'full' && options.enableMarginLeft }
							className="ugb--help-tip-advanced-block-margins"
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="mobile">
						<FourRangeControl
							label={ __( 'Block Margins', i18n ) }
							units={ options.marginUnits }
							screens={ [ 'desktop', 'tablet', 'mobile' ] }
							defaultLocked={ false }
							top={ mobileMarginTop }
							bottom={ mobileMarginBottom }
							right={ mobileMarginRight }
							left={ mobileMarginLeft }
							unit={ mobileMarginUnit }
							min={ [ -500, -100 ] }
							max={ [ 500, 100 ] }
							onChange={ margins => {
								setAttributes( {
									mobileMarginTop: ! margins.top && margins.top !== 0 ? '' : parseInt( margins.top, 10 ),
									mobileMarginRight: ! margins.right && margins.right !== 0 ? '' : parseInt( margins.right, 10 ),
									mobileMarginBottom: ! margins.bottom && margins.bottom !== 0 ? '' : parseInt( margins.bottom, 10 ),
									mobileMarginLeft: ! margins.left && margins.left !== 0 ? '' : parseInt( margins.left, 10 ),
								} )
							} }
							onChangeUnit={ mobileMarginUnit => setAttributes( { mobileMarginUnit } ) }
							enableTop={ options.enableMarginTop }
							enableRight={ align !== 'full' && options.enableMarginRight }
							enableBottom={ options.enableMarginBottom }
							enableLeft={ align !== 'full' && options.enableMarginLeft }
							className="ugb--help-tip-advanced-block-margins"
						/>
					</WhenResponsiveScreen>
				</Fragment> }
				{ options.paddings && <Fragment>
					<WhenResponsiveScreen screen="desktop">
						<FourRangeControl
							label={ __( 'Block Paddings', i18n ) }
							units={ options.paddingUnits }
							screens={ [ 'desktop', 'tablet', 'mobile' ] }
							defaultLocked={ false }
							top={ paddingTop }
							bottom={ paddingBottom }
							right={ paddingRight }
							left={ paddingLeft }
							unit={ paddingUnit }
							min={ [ 0, 0, 0 ] }
							sliderMax={ [ 500, 100, 100 ] }
							onChange={ paddings => {
								setAttributes( {
									paddingTop: ! paddings.top && paddings.top !== 0 ? '' : parseInt( paddings.top, 10 ),
									paddingRight: ! paddings.right && paddings.right !== 0 ? '' : parseInt( paddings.right, 10 ),
									paddingBottom: ! paddings.bottom && paddings.bottom !== 0 ? '' : parseInt( paddings.bottom, 10 ),
									paddingLeft: ! paddings.left && paddings.left !== 0 ? '' : parseInt( paddings.left, 10 ),
								} )
							} }
							onChangeUnit={ paddingUnit => setAttributes( { paddingUnit } ) }
							enableTop={ options.enablePaddingTop }
							enableRight={ options.enablePaddingRight }
							enableBottom={ options.enablePaddingBottom }
							enableLeft={ options.enablePaddingLeft }
							placeholder="0"
							className="ugb--help-tip-advanced-block-paddings"
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="tablet">
						<FourRangeControl
							label={ __( 'Block Paddings', i18n ) }
							units={ options.paddingUnits }
							screens={ [ 'desktop', 'tablet', 'mobile' ] }
							defaultLocked={ false }
							top={ tabletPaddingTop }
							bottom={ tabletPaddingBottom }
							right={ tabletPaddingRight }
							left={ tabletPaddingLeft }
							unit={ tabletPaddingUnit }
							min={ [ 0, 0, 0 ] }
							sliderMax={ [ 500, 100, 100 ] }
							onChange={ paddings => {
								setAttributes( {
									tabletPaddingTop: ! paddings.top && paddings.top !== 0 ? '' : parseInt( paddings.top, 10 ),
									tabletPaddingRight: ! paddings.right && paddings.right !== 0 ? '' : parseInt( paddings.right, 10 ),
									tabletPaddingBottom: ! paddings.bottom && paddings.bottom !== 0 ? '' : parseInt( paddings.bottom, 10 ),
									tabletPaddingLeft: ! paddings.left && paddings.left !== 0 ? '' : parseInt( paddings.left, 10 ),
								} )
							} }
							onChangeUnit={ tabletPaddingUnit => setAttributes( { tabletPaddingUnit } ) }
							enableTop={ options.enablePaddingTop }
							enableRight={ options.enablePaddingRight }
							enableBottom={ options.enablePaddingBottom }
							enableLeft={ options.enablePaddingLeft }
							className="ugb--help-tip-advanced-block-paddings"
						/>
					</WhenResponsiveScreen>
					<WhenResponsiveScreen screen="mobile">
						<FourRangeControl
							label={ __( 'Block Paddings', i18n ) }
							units={ options.paddingUnits }
							screens={ [ 'desktop', 'tablet', 'mobile' ] }
							defaultLocked={ false }
							top={ mobilePaddingTop }
							bottom={ mobilePaddingBottom }
							right={ mobilePaddingRight }
							left={ mobilePaddingLeft }
							unit={ mobilePaddingUnit }
							min={ [ 0, 0, 0 ] }
							sliderMax={ [ 500, 100, 100 ] }
							onChange={ paddings => {
								setAttributes( {
									mobilePaddingTop: ! paddings.top && paddings.top !== 0 ? '' : parseInt( paddings.top, 10 ),
									mobilePaddingRight: ! paddings.right && paddings.right !== 0 ? '' : parseInt( paddings.right, 10 ),
									mobilePaddingBottom: ! paddings.bottom && paddings.bottom !== 0 ? '' : parseInt( paddings.bottom, 10 ),
									mobilePaddingLeft: ! paddings.left && paddings.left !== 0 ? '' : parseInt( paddings.left, 10 ),
								} )
							} }
							onChangeUnit={ mobilePaddingUnit => setAttributes( { mobilePaddingUnit } ) }
							enableTop={ options.enablePaddingTop }
							enableRight={ options.enablePaddingRight }
							enableBottom={ options.enablePaddingBottom }
							enableLeft={ options.enablePaddingLeft }
							className="ugb--help-tip-advanced-block-paddings"
						/>
					</WhenResponsiveScreen>
				</Fragment> }

				{ applyFilters( `stackable.${ blockName }.edit.advanced.block-spacing.after`, null, props ) }
			</PanelAdvancedSettings>
		</Fragment>
	)
}

const addToStyleObject = blockName => ( styleObject, props ) => {
	const getValue = __getValue( props.attributes )

	const {
		blockInnerWidth = '',

		marginUnit = 'px',
		tabletMarginUnit = 'px',
		mobileMarginUnit = 'px',
		paddingUnit = 'px',
		tabletPaddingUnit = 'px',
		mobilePaddingUnit = 'px',

		blockHeightUnit = 'px',
		tabletBlockHeightUnit = 'px',
		mobileBlockHeightUnit = 'px',

		blockWidthUnit = 'px',
		tabletBlockWidthUnit = 'px',
		mobileBlockWidthUnit = 'px',
	} = props.attributes

	const blockClass = `.${ props.mainClassName }`

	const margins = applyFilters( `stackable.${ blockName }.advanced-block-spacing.margins`, {
		desktopTablet: {
			[ blockClass ]: appendImportantAll( {
				marginTop: getValue( 'marginTop', `%s${ marginUnit }` ),
				marginBottom: getValue( 'marginBottom', `%s${ marginUnit }` ),
				marginRight: getValue( 'marginRight', `%s${ marginUnit }` ),
				marginLeft: getValue( 'marginLeft', `%s${ marginUnit }` ),
			} ),
		},
		tabletOnly: {
			[ blockClass ]: appendImportantAll( {
				marginRight: getValue( 'tabletMarginRight', `%s${ tabletMarginUnit }` ),
				marginLeft: getValue( 'tabletMarginLeft', `%s${ tabletMarginUnit }` ),
				marginTop: getValue( 'tabletMarginTop', `%s${ tabletMarginUnit }` ),
				marginBottom: getValue( 'tabletMarginBottom', `%s${ tabletMarginUnit }` ),
			} ),
		},
		mobile: {
			[ blockClass ]: appendImportantAll( {
				marginRight: getValue( 'mobileMarginRight', `%s${ mobileMarginUnit }` ),
				marginLeft: getValue( 'mobileMarginLeft', `%s${ mobileMarginUnit }` ),
				marginTop: getValue( 'mobileMarginTop', `%s${ mobileMarginUnit }` ),
				marginBottom: getValue( 'mobileMarginBottom', `%s${ mobileMarginUnit }` ),
			} ),
		},
	} )

	const paddings = applyFilters( `stackable.${ blockName }.advanced-block-spacing.paddings`, {
		desktopTablet: {
			[ blockClass ]: appendImportantAll( {
				paddingTop: getValue( 'paddingTop', `%s${ paddingUnit }` ),
				paddingRight: getValue( 'paddingRight', `%s${ paddingUnit }` ),
				paddingBottom: getValue( 'paddingBottom', `%s${ paddingUnit }` ),
				paddingLeft: getValue( 'paddingLeft', `%s${ paddingUnit }` ),
			} ),
		},
		tabletOnly: {
			[ blockClass ]: appendImportantAll( {
				paddingTop: getValue( 'tabletPaddingTop', `%s${ tabletPaddingUnit }` ),
				paddingRight: getValue( 'tabletPaddingRight', `%s${ tabletPaddingUnit }` ),
				paddingBottom: getValue( 'tabletPaddingBottom', `%s${ tabletPaddingUnit }` ),
				paddingLeft: getValue( 'tabletPaddingLeft', `%s${ tabletPaddingUnit }` ),
			} ),
		},
		mobile: {
			[ blockClass ]: appendImportantAll( {
				paddingTop: getValue( 'mobilePaddingTop', `%s${ mobilePaddingUnit }` ),
				paddingRight: getValue( 'mobilePaddingRight', `%s${ mobilePaddingUnit }` ),
				paddingBottom: getValue( 'mobilePaddingBottom', `%s${ mobilePaddingUnit }` ),
				paddingLeft: getValue( 'mobilePaddingLeft', `%s${ mobilePaddingUnit }` ),
			} ),
		},
	} )

	const others = {
		[ blockClass ]: {
			minHeight: getValue( 'blockHeight', `%s${ blockHeightUnit || 'px' }` ),
			justifyContent: getValue( 'blockHorizontalAlign' ),
			alignItems: getValue( 'blockVerticalAlign' ),
		},
		[ `${ blockClass } > .ugb-inner-block` ]: {
			// Some themes can limit min-width, preventing block width.
			minWidth: blockInnerWidth === 'wide' && getValue( 'blockWidth' ) ? 'auto !important' : undefined,
			maxWidth: appendImportant( getValue( 'blockWidth', `%s${ blockWidthUnit || 'px' }` ) ),
		},
		tablet: {
			[ blockClass ]: {
				minHeight: getValue( 'tabletBlockHeight', `%s${ tabletBlockHeightUnit || 'px' }` ),
				justifyContent: getValue( 'tabletBlockHorizontalAlign' ),
				alignItems: getValue( 'tabletBlockVerticalAlign' ),
			},
			[ `${ blockClass } > .ugb-inner-block` ]: {
				// Some themes can limit min-width, preventing block width.
				minWidth: blockInnerWidth === 'wide' && getValue( 'tabletBlockWidth' ) ? 'auto !important' : undefined,
				maxWidth: appendImportant( getValue( 'tabletBlockWidth', `%s${ tabletBlockWidthUnit || 'px' }` ) ),
			},
		},
		mobile: {
			[ blockClass ]: {
				minHeight: getValue( 'mobileBlockHeight', `%s${ mobileBlockHeightUnit || 'px' }` ),
				justifyContent: getValue( 'mobileBlockHorizontalAlign' ),
				alignItems: getValue( 'mobileBlockVerticalAlign' ),
			},
			[ `${ blockClass } > .ugb-inner-block` ]: {
				// Some themes can limit min-width, preventing block width.
				minWidth: blockInnerWidth === 'wide' && getValue( 'mobileBlockWidth' ) ? 'auto !important' : undefined,
				maxWidth: appendImportant( getValue( 'mobileBlockWidth', `%s${ mobileBlockWidthUnit || 'px' }` ) ),
			},
		},
		ie11: {
			[ blockClass ]: {
				height: getValue( 'blockHeight', `%s${ blockHeightUnit }` ) || undefined,
			},
		},
	}

	return deepmerge.all( [ styleObject, margins, paddings, others ] )
}

const addAttributes = attributes => {
	return {
		...attributes,

		...createAllCombinationAttributes(
			'%sMargin%s',
			{
				type: 'number',
				default: '',
			},
			[ '', 'Tablet', 'Mobile' ],
			[ 'Top', 'Right', 'Bottom', 'Left' ]
		),

		...createAllCombinationAttributes(
			'%sMarginUnit',
			{
				type: 'string',
				default: 'px',
			},
			[ '', 'Tablet', 'Mobile' ],
		),

		...createAllCombinationAttributes(
			'%sPadding%s',
			{
				type: 'number',
				default: '',
			},
			[ '', 'Tablet', 'Mobile' ],
			[ 'Top', 'Right', 'Bottom', 'Left' ]
		),

		...createAllCombinationAttributes(
			'%sPaddingUnit',
			{
				type: 'string',
				default: 'px',
			},
			[ '', 'Tablet', 'Mobile' ],
		),

		...createAllCombinationAttributes(
			'%sBlockHeight',
			{
				type: 'number',
				default: '',
			},
			[ '', 'Tablet', 'Mobile' ]
		),

		...createAllCombinationAttributes(
			'%sBlockHeightUnit',
			{
				type: 'string',
				default: 'px',
			},
			[ '', 'Tablet', 'Mobile' ]
		),

		...createAllCombinationAttributes(
			'%sBlockWidth',
			{
				type: 'number',
				default: '',
			},
			[ '', 'Tablet', 'Mobile' ]
		),

		...createAllCombinationAttributes(
			'%sBlockWidthUnit',
			{
				type: 'string',
				default: 'px',
			},
			[ '', 'Tablet', 'Mobile' ]
		),

		...createAllCombinationAttributes(
			'%sBlock%sAlign',
			{
				type: 'string',
				default: '',
			},
			[ '', 'Tablet', 'Mobile' ],
			[ 'Vertical', 'Horizontal' ]
		),
	}
}

const addCustomWidthClassName = ( mainClasses, props ) => {
	const {
		blockWidth = '',
		tabletBlockWidth = '',
		mobileBlockWidth = '',
	} = props.attributes

	return {
		...mainClasses,
		'ugb--has-custom-content-width': blockWidth !== '',
		'ugb--has-custom-content-width-tablet': tabletBlockWidth !== '',
		'ugb--has-custom-content-width-mobile': mobileBlockWidth !== '',
	}
}

const advancedBlockSpacing = ( blockName, options = {} ) => {
	const optionsToPass = {
		margins: true,
		paddings: true,
		height: true,
		width: true,
		horizontalAlign: true,
		verticalAlign: true,
		modifyStyles: true,
		enableMarginTop: true,
		enableMarginRight: true,
		enableMarginBottom: true,
		enableMarginLeft: true,
		enablePaddingTop: true,
		enablePaddingRight: true,
		enablePaddingBottom: true,
		enablePaddingLeft: true,
		paddingUnits: [ 'px', 'em', '%' ],
		marginUnits: [ 'px', '%' ],
		...options,
	}

	addFilter( `stackable.${ blockName }.edit.inspector.advanced.before`, `stackable/${ blockName }/advanced-block-spacing`, inspectorControls( blockName, optionsToPass ), 5 )
	if ( optionsToPass.modifyStyles ) {
		addFilter( `stackable.${ blockName }.styles`, `stackable/${ blockName }/advanced-block-spacing`, addToStyleObject( blockName, optionsToPass ) )
	}
	addFilter( `stackable.${ blockName }.attributes`, `stackable/${ blockName }/advanced-block-spacing`, addAttributes )
	addFilter( `stackable.${ blockName }.main-block.classes`, `stackable/${ blockName }/advanced-block-spacing`, addCustomWidthClassName )
	doAction( `stackable.module.advanced-block-spacing`, blockName )
}

export default advancedBlockSpacing
