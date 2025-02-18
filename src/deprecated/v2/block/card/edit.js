/**
 * External dependencies
 */
import {
	DesignPanelBody,
	ImageUploadPlaceholder,
	ProControlButton,
	BlockContainer,
	BackgroundControlsHelper,
	PanelAdvancedSettings,
	TypographyControlHelper,
	ColorPaletteControl,
	HeadingButtonsControl,
	AlignButtonsControl,
	ControlSeparator,
	ButtonControlsHelper,
	PanelSpacingBody,
	AdvancedRangeControl,
	ImageBackgroundControlsHelper,
	WhenResponsiveScreen,
	ColumnPaddingControl,
	ButtonIconPopoverControl,
	BorderControlsHelper,
} from '~stackable/components'
import {
	ButtonEditHelper,
	DivBackground,
	ContentAlignControl,
	ResponsiveControl,
} from '../../components'
import {
	descriptionPlaceholder,
	createTypographyAttributeNames,
	createResponsiveAttributeNames,
	createButtonAttributeNames,
	cacheImageData,
	getImageUrlFromCache,
	createImageBackgroundAttributeNames,
} from '~stackable/util'
import classnames from 'classnames'
import { range } from 'lodash'
import {
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector,
	withContentAlignReseter,
	withBlockStyles,
	withClickOpenInspector,
} from '../../higher-order'

/**
 * Internal dependencies
 */
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'
import ImageDesignFaded from './images/faded.png'
import ImageDesignFull from './images/full.png'
import ImageDesignHorizontal from './images/horizontal.png'
import { i18n, showProNotice } from 'stackable'
import createStyles from './style'
import { showOptions } from './util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters, addFilter } from '@wordpress/hooks'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'
import { RichText } from '@wordpress/block-editor'
import { withSelect } from '@wordpress/data'

addFilter( 'stackable.card.edit.layouts', 'default', layouts => {
	const newLayouts = [
		{
			label: __( 'Basic', i18n ), value: 'basic', image: ImageDesignBasic,
		},
		{
			label: __( 'Plain', i18n ), value: 'plain', image: ImageDesignPlain,
		},
		{
			label: __( 'Horizontal', i18n ), value: 'horizontal', image: ImageDesignHorizontal, premium: true,
		},
		{
			label: __( 'Full', i18n ), value: 'full', image: ImageDesignFull, premium: true,
		},
		{
			label: __( 'Faded', i18n ), value: 'faded', image: ImageDesignFaded, premium: true,
		},
	]
	return [
		...layouts,
		...newLayouts,

	]
} )

addFilter( 'stackable.card.edit.inspector.layout.before', 'stackable/card', ( output, props ) => {
	const { setAttributes } = props
	const {
		design = 'basic',
	} = props.attributes

	return (
		<Fragment>
			{ output }
			<DesignPanelBody
				initialOpen={ true }
				selected={ design }
				options={ applyFilters( 'stackable.card.edit.layouts', [] ) }
				onChange={ design => setAttributes( { design } ) }
			>
				{ showProNotice && <ProControlButton /> }
			</DesignPanelBody>
		</Fragment>
	)
} )

addFilter( 'stackable.card.edit.inspector.style.before', 'stackable/card', ( output, props ) => {
	const { setAttributes } = props
	const {
		columns,
		borderRadius = '',
		shadow = '',
		showImage = true,
		showTitle = true,
		showSubtitle = true,
		showDescription = true,
		showButton = true,
		image1Id = '',
		image2Id = '',
		image3Id = '',
		imageBackgroundWidth = '',
		imageBackgroundTabletWidth = '',
		imageBackgroundMobileWidth = '',
		imageBackgroundWidthUnit = '%',
		imageBackgroundTabletWidthUnit = '%',
		imageBackgroundMobileWidthUnit = '%',
		titleTag = '',
		titleColor = '',
		descriptionColor = '',
		subtitleColor = true,
	} = props.attributes

	const show = showOptions( props )

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'General', i18n ) }
				initialOpen={ true }
			>
				<AdvancedRangeControl
					label={ __( 'Columns', i18n ) }
					value={ columns }
					onChange={ columns => setAttributes( { columns } ) }
					min={ 1 }
					max={ 3 }
					className="ugb--help-tip-general-columns"
					default={ 2 }
				/>

				{ ( ! show.columnBackground && show.borderRadius ) &&
					<AdvancedRangeControl
						label={ __( 'Border Radius', i18n ) }
						value={ borderRadius }
						onChange={ borderRadius => setAttributes( { borderRadius } ) }
						min={ 0 }
						max={ 50 }
						allowReset={ true }
						placeholder="12"
						className="ugb--help-tip-general-border-radius"
					/>
				}
				{ ( ! show.columnBackground && show.shadow ) &&
					<AdvancedRangeControl
						label={ __( 'Shadow / Outline', i18n ) }
						value={ shadow }
						onChange={ shadow => setAttributes( { shadow } ) }
						min={ 0 }
						max={ 9 }
						allowReset={ true }
						placeholder="3"
						className="ugb--help-tip-general-shadow"
					/>
				}
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelAdvancedSettings>

			{ show.columnBackground &&
				<PanelAdvancedSettings
					title={ __( 'Container', i18n ) }
					id="column-background"
					initialOpen={ false }
					// className="ugb--help-tip-column-background-on-off"
				>
					<ButtonIconPopoverControl
						label={ __( 'Background', i18n ) }
						popoverLabel={ __( 'Background', i18n ) }
						onReset={ () => {
							setAttributes( {
								columnBackgroundColorType: '',
								columnBackgroundColor: '',
								columnBackgroundColor2: '',
								columnBackgroundColorOpacity: '',
								columnBackgroundMediaID: '',
								columnBackgroundMediaUrl: '',
								columnBackgroundTintStrength: '',
								columnFixedBackground: '',
							} )
						} }
						allowReset={ props.attributes.columnBackgroundColor || props.attributes.columnBackgroundMediaUrl }
						hasColorPreview={ props.attributes.columnBackgroundColor }
						hasImagePreview={ props.attributes.columnBackgroundMediaUrl }
						colorPreview={ props.attributes.columnBackgroundColorType === 'gradient' ? [ props.attributes.columnBackgroundColor, props.attributes.columnBackgroundColor2 ] : props.attributes.columnBackgroundColor }
						imageUrlPreview={ props.attributes.columnBackgroundMediaUrl }
					>
						<BackgroundControlsHelper
							attrNameTemplate="column%s"
							setAttributes={ setAttributes }
							blockAttributes={ props.attributes }
						/>
					</ButtonIconPopoverControl>

					{ show.border &&
						<BorderControlsHelper
							attrNameTemplate="column%s"
							setAttributes={ setAttributes }
							blockAttributes={ props.attributes }
						/>
					}

					{ show.borderRadius &&
						<AdvancedRangeControl
							label={ __( 'Border Radius', i18n ) }
							value={ borderRadius }
							onChange={ borderRadius => setAttributes( { borderRadius } ) }
							min={ 0 }
							max={ 50 }
							allowReset={ true }
							placeholder="12"
							className="ugb--help-tip-general-border-radius"
						/>
					}

					{ show.shadow &&
						<AdvancedRangeControl
							label={ __( 'Shadow / Outline', i18n ) }
							value={ shadow }
							onChange={ shadow => setAttributes( { shadow } ) }
							min={ 0 }
							max={ 9 }
							allowReset={ true }
							placeholder="3"
							className="ugb--help-tip-general-shadow"
						/>
					}
				</PanelAdvancedSettings>
			}

			<PanelSpacingBody
				initialOpen={ false }
				blockProps={ props }
			>
				<ColumnPaddingControl
					label={ __( 'Paddings', i18n ) }
					setAttributes={ setAttributes }
					attributes={ props.attributes }
				/>
				{ show.imageSpacing &&
					<ResponsiveControl
						attrNameTemplate="image%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Image', i18n ) }
							min={ -50 }
							max={ 100 }
							placeholder="0"
							allowReset={ true }
							className="ugb--help-tip-spacing-image"
						/>
					</ResponsiveControl>
				}
				{ show.titleSpacing &&
					<ResponsiveControl
						attrNameTemplate="title%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Title', i18n ) }
							min={ -50 }
							max={ 100 }
							placeholder="8"
							allowReset={ true }
							className="ugb--help-tip-spacing-title"
						/>
					</ResponsiveControl>
				}
				{ show.subtitleSpacing &&
					<ResponsiveControl
						attrNameTemplate="subtitle%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Subtitle', i18n ) }
							min={ -50 }
							max={ 100 }
							placeholder="16"
							allowReset={ true }
							className="ugb--help-tip-spacing-title"
						/>
					</ResponsiveControl>
				}
				{ show.descriptionSpacing &&
					<ResponsiveControl
						attrNameTemplate="description%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Description', i18n ) }
							min={ -50 }
							max={ 100 }
							placeholder="16"
							allowReset={ true }
							className="ugb--help-tip-spacing-description"
						/>
					</ResponsiveControl>
				}
				{ show.buttonSpacing &&
					<ResponsiveControl
						attrNameTemplate="button%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Button', i18n ) }
							min={ -50 }
							max={ 100 }
							placeholder="0"
							allowReset={ true }
							className="ugb--help-tip-spacing-button"
						/>
					</ResponsiveControl>
				}
			</PanelSpacingBody>

			<PanelAdvancedSettings
				title={ __( 'Image', i18n ) }
				checked={ showImage }
				onChange={ showImage => setAttributes( { showImage } ) }
				toggleOnSetAttributes={ [
					...createImageBackgroundAttributeNames( 'image%s' ),
					...createResponsiveAttributeNames( 'imageBackground%sHeight' ),
					...createResponsiveAttributeNames( 'imageBackground%sWidth' ),
				] }
				toggleAttributeName="showImage"
			>
				<ImageBackgroundControlsHelper
					attrNameTemplate="image%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
					onChangeImage={ null }
					onChangeSize={ size => {
						setAttributes( {
							imageSize: size,
							image1Url: getImageUrlFromCache( image1Id, size || 'large' ),
							image2Url: getImageUrlFromCache( image2Id, size || 'large' ),
							image3Url: getImageUrlFromCache( image3Id, size || 'large' ),
						} )
					} }
				/>
				{ show.imageHeight &&
					<ResponsiveControl
						attrNameTemplate="imageBackground%sHeight"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Image Height', i18n ) }
							min={ 0 }
							max={ 1000 }
							allowReset={ true }
							placeholder="300"
							className="ugb--help-tip-image-height-crop"
						/>
					</ResponsiveControl>
				}
				{ show.imageWidth &&
					<Fragment>
						<WhenResponsiveScreen>
							<AdvancedRangeControl
								label={ __( 'Image Width', i18n ) }
								units={ [ 'px', '%' ] }
								min={ [ 0, 0 ] }
								max={ [ 1000, 90 ] }
								step={ [ 1, 1 ] }
								allowReset={ true }
								value={ imageBackgroundWidth }
								unit={ imageBackgroundWidthUnit }
								onChange={ imageBackgroundWidth => setAttributes( { imageBackgroundWidth } ) }
								onChangeUnit={ imageBackgroundWidthUnit => setAttributes( { imageBackgroundWidthUnit } ) }
								placeholder="50"
								className="ugb--help-tip-image-width-crop"
							/>
						</WhenResponsiveScreen>
						<WhenResponsiveScreen screen="tablet">
							<AdvancedRangeControl
								label={ __( 'Image Width', i18n ) }
								units={ [ 'px', '%' ] }
								min={ [ 0, 0 ] }
								max={ [ 1000, 90 ] }
								step={ [ 1, 1 ] }
								allowReset={ true }
								value={ imageBackgroundTabletWidth }
								unit={ imageBackgroundTabletWidthUnit }
								onChange={ imageBackgroundTabletWidth => setAttributes( { imageBackgroundTabletWidth } ) }
								onChangeUnit={ imageBackgroundTabletWidthUnit => setAttributes( { imageBackgroundTabletWidthUnit } ) }
								placeholder="50"
								className="ugb--help-tip-image-width-crop"
							/>
						</WhenResponsiveScreen>
						<WhenResponsiveScreen screen="mobile">
							<AdvancedRangeControl
								label={ __( 'Image Width', i18n ) }
								units={ [ 'px', '%' ] }
								min={ [ 0, 0 ] }
								max={ [ 1000, 90 ] }
								step={ [ 1, 1 ] }
								allowReset={ true }
								value={ imageBackgroundMobileWidth }
								unit={ imageBackgroundMobileWidthUnit }
								onChange={ imageBackgroundMobileWidth => setAttributes( { imageBackgroundMobileWidth } ) }
								onChangeUnit={ imageBackgroundMobileWidthUnit => setAttributes( { imageBackgroundMobileWidthUnit } ) }
								placeholder="50"
								className="ugb--help-tip-image-width-crop"
							/>
						</WhenResponsiveScreen>
					</Fragment>
				}
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Title', i18n ) }
				id="title"
				checked={ showTitle }
				onChange={ showTitle => setAttributes( { showTitle } ) }
				toggleOnSetAttributes={ [
					...createTypographyAttributeNames( 'title%s' ),
					'titleTag',
					'titleColor',
					...createResponsiveAttributeNames( 'Title%sAlign' ),
				] }
				hasToggle
				toggleAttributeName="showTitle"
			>
				<HeadingButtonsControl
					value={ titleTag || 'h4' }
					defaultValue="h4"
					onChange={ titleTag => setAttributes( { titleTag } ) }
				/>
				<TypographyControlHelper
					attrNameTemplate="title%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
					htmlTag={ titleTag || 'h4' }
				/>
				<ColorPaletteControl
					value={ titleColor }
					onChange={ titleColor => setAttributes( { titleColor } ) }
					label={ __( 'Title Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="Title%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-title"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Subtitle', i18n ) }
				id="subtitle"
				checked={ showSubtitle }
				onChange={ showSubtitle => setAttributes( { showSubtitle } ) }
				toggleOnSetAttributes={ [
					...createTypographyAttributeNames( 'subtitle%s' ),
					'subtitleColor',
					...createResponsiveAttributeNames( 'subtitle%sAlign' ),
				] }
				hasToggle
				toggleAttributeName="showSubtitle"
			>
				<TypographyControlHelper
					attrNameTemplate="subtitle%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
					placeholder={ size => size * 0.8 } // 0.8em
				/>
				<ColorPaletteControl
					value={ subtitleColor }
					onChange={ subtitleColor => setAttributes( { subtitleColor } ) }
					label={ __( 'Subtitle Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="subtitle%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-title"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Description', i18n ) }
				id="description"
				checked={ showDescription }
				onChange={ showDescription => setAttributes( { showDescription } ) }
				toggleOnSetAttributes={ [
					...createTypographyAttributeNames( 'description%s' ),
					'descriptionColor',
					...createResponsiveAttributeNames( 'description%sAlign' ),
				] }
				hasToggle
				toggleAttributeName="showDescription"
			>
				<TypographyControlHelper
					attrNameTemplate="description%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<ColorPaletteControl
					value={ descriptionColor }
					onChange={ descriptionColor => setAttributes( { descriptionColor } ) }
					label={ __( 'Description Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="description%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-description"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Button', i18n ) }
				id="button"
				checked={ showButton }
				onChange={ showButton => setAttributes( { showButton } ) }
				toggleOnSetAttributes={ [
					...createButtonAttributeNames( 'button%s' ),
					...createResponsiveAttributeNames( 'button%sAlign' ),
				] }
				hasToggle
				toggleAttributeName="showButton"
			>
				<ButtonControlsHelper
					attrNameTemplate="button%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
					onChangeUrl={ false }
					onChangeNewTab={ false }
					onChangeNoFollow={ false }
					placeholder="21"
				/>
				<ControlSeparator />
				<ResponsiveControl
					attrNameTemplate="Button%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-button"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

		</Fragment>
	)
} )

const edit = props => {
	const {
		className,
		setAttributes,
		attributes,
	} = props

	const {
		columns = 2,
		design = 'basic',
		shadow = '',
		imageSize = '',
		titleTag = 'h4',
		showImage = true,
		showTitle = true,
		showSubtitle = true,
		showDescription = true,
		showButton = true,
		buttonIcon = '',
	} = attributes

	const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		'ugb-card--v2',
		`ugb-card--design-${ design }`,
		`ugb-card--columns-${ columns }`,
	], applyFilters( 'stackable.card.mainclasses', {
	}, props ) )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ range( 1, columns + 1 ).map( i => {
					const imageUrl = attributes[ `image${ i }Url` ]
					const imageId = attributes[ `image${ i }Id` ]
					const title = attributes[ `title${ i }` ]
					const subtitle = attributes[ `subtitle${ i }` ]
					const description = attributes[ `description${ i }` ]
					const buttonText = attributes[ `button${ i }Text` ]

					const itemClasses = classnames( [
						'ugb-card__item',
						`ugb-card__item${ i }`,
					], applyFilters( 'stackable.card.itemclasses', {
						[ `ugb--shadow-${ shadow }` ]: show.columnBackground && shadow !== '',
					}, props ) )

					const imageClasses = classnames( [
						'ugb-card__image',
					], applyFilters( 'stackable.card.imageclasses', {
						[ `ugb--shadow-${ shadow }` ]: ! show.columnBackground,
					}, props ) )

					return (
						<DivBackground
							className={ itemClasses }
							backgroundAttrName="column%s"
							blockProps={ props }
							showBackground={ show.columnBackground }
							index={ i }
							key={ i }
						>
							{ showImage &&
								<ImageUploadPlaceholder
									imageID={ imageId }
									imageURL={ imageUrl }
									imageSize={ imageSize }
									className={ imageClasses }
									onRemove={ () => {
										setAttributes( {
											[ `image${ i }Url` ]: '',
											[ `image${ i }Id` ]: '',
										} )
									} }
									onChange={ image => {
										setAttributes( {
											[ `image${ i }Url` ]: image.url,
											[ `image${ i }Id` ]: image.id,
										} )
									} }
								/>
							}
							<div className="ugb-card__content">
								{ showTitle &&
									<RichText
										tagName={ titleTag || 'h4' }
										value={ title }
										className="ugb-card__title"
										placeholder={ __( 'Title for This Block', i18n ) }
										onChange={ value => setAttributes( { [ `title${ i }` ]: value } ) }
										keepPlaceholderOnFocus
									/>
								}
								{ showSubtitle &&
									<RichText
										tagName="p"
										value={ subtitle }
										className="ugb-card__subtitle"
										onChange={ value => setAttributes( { [ `subtitle${ i }` ]: value } ) }
										placeholder={ __( 'Subtitle for this block', i18n ) }
										keepPlaceholderOnFocus
									/>
								}
								{ showDescription &&
									<RichText
										tagName="p"
										value={ description }
										className="ugb-card__description"
										onChange={ value => setAttributes( { [ `description${ i }` ]: value } ) }
										placeholder={ descriptionPlaceholder( 'medium' ) }
										keepPlaceholderOnFocus
									/>
								}
								{ showButton &&
									<ButtonEditHelper
										attrNameTemplate={ `button%s` }
										setAttributes={ setAttributes }
										blockAttributes={ props.attributes }
										text={ buttonText }
										icon={ attributes[ `button${ i }Icon` ] || buttonIcon }
										onChange={ value => setAttributes( { [ `button${ i }Text` ]: value } ) }
										onChangeIcon={ value => setAttributes( { [ `button${ i }Icon` ]: value } ) }
										url={ attributes[ `button${ i }Url` ] }
										newTab={ attributes[ `button${ i }NewTab` ] }
										noFollow={ attributes[ `button${ i }NoFollow` ] }
										sponsored={ attributes[ `button${ i }Sponsored` ] }
										ugc={ attributes[ `button${ i }Ugc` ] }
										onChangeUrl={ value => setAttributes( { [ `button${ i }Url` ]: value } ) }
										onChangeNewTab={ value => setAttributes( { [ `button${ i }NewTab` ]: value } ) }
										onChangeNoFollow={ value => setAttributes( { [ `button${ i }NoFollow` ]: value } ) }
										onChangeSponsored={ value => setAttributes( { [ `button${ i }Sponsored` ]: value } ) }
										onChangeUgc={ value => setAttributes( { [ `button${ i }Ugc` ]: value } ) }
									/>
								}
							</div>
						</DivBackground>
					)
				} ) }
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector(),
	withContentAlignReseter( [ 'Title%sAlign', 'Subtitle%sAlign', 'Description%sAlign', 'Button%sAlign' ] ),
	withBlockStyles( createStyles, { editorMode: true } ),
	withClickOpenInspector( [
		[ '.ugb-card__title', 'title' ],
		[ '.ugb-card__subtitle', 'subtitle' ],
		[ '.ugb-card__description', 'description' ],
		[ '.ugb-button', 'button' ],
		[ '.ugb-card__item', 'column-background' ],
	] ),
	withSelect( ( select, props ) => {
		// Once the editor is loaded, cache the other sizes of the image.
		cacheImageData( props.attributes.image1Id, select )
		cacheImageData( props.attributes.image2Id, select )
		cacheImageData( props.attributes.image3Id, select )
	} ),
)( edit )
