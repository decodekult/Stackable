/**
 * External dependencies
 */
import {
	AdvancedRangeControl,
	AlignButtonsControl,
	BackgroundControlsHelper,
	BlockContainer,
	ColorPaletteControl,
	DesignPanelBody,
	HeadingButtonsControl,
	PanelAdvancedSettings,
	PanelSpacingBody,
	ProControlButton,
	TypographyControlHelper,
	ButtonIconPopoverControl,
	ColumnPaddingControl,
	BorderControlsHelper,
} from '~stackable/components'
import {
	ContentAlignControl, DivBackground, ResponsiveControl,
} from '../../components'
import {
	createResponsiveAttributeNames,
	createTypographyAttributeNames,
	descriptionPlaceholder,
	range,
} from '~stackable/util'
import {
	withBlockStyles,
	withContentAlignReseter,
	withGoogleFont,
	withSetAttributeHook,
	withTabbedInspector,
	withUniqueClass,
	withClickOpenInspector,
} from '../../higher-order'
import classnames from 'classnames'
import { i18n, showProNotice } from 'stackable'

/**
 * Internal dependencies
 */
import createStyles from './style'
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'
import ImageDesignBackground from './images/background.png'
import ImageDesignFaded from './images/faded.png'
import ImageDesignHeading from './images/heading.png'
import ImageDesignHeading2 from './images/heading2.png'
import { showOptions } from './util'

/**
 * WordPress dependencies
 */
import {
	__, _x, sprintf,
} from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { SelectControl, TextControl } from '@wordpress/components'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'
import { RichText } from '@wordpress/block-editor'

addFilter( 'stackable.number-box.edit.layouts', 'default', layouts => {
	const newLayouts = [
		{
			image: ImageDesignBasic, label: __( 'Basic', i18n ), value: 'basic',
		},
		{
			image: ImageDesignPlain, label: __( 'Plain', i18n ), value: 'plain',
		},
		{
			label: __( 'Background', i18n ), value: 'background', image: ImageDesignBackground, premium: true,
		},
		{
			label: __( 'Heading', i18n ), value: 'heading', image: ImageDesignHeading, premium: true,
		},
		{
			label: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Heading', i18n ), 2 ), value: 'heading2', image: ImageDesignHeading2, premium: true,
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

addFilter( 'stackable.number-box.edit.inspector.layout.before', 'stackable/number-box', ( output, props ) => {
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
				options={ applyFilters( 'stackable.number-box.edit.layouts', [] ) }
				onChange={ design => {
					setAttributes( { design } )
				} }
			>
				{ showProNotice && <ProControlButton /> }
			</DesignPanelBody>
		</Fragment>
	)
} )

addFilter( 'stackable.number-box.edit.inspector.style.before', 'stackable/number-box', ( output, props ) => {
	const { setAttributes } = props
	const {
		columns,
		numberColor,
		titleColor,
		descriptionColor,
		numberBGColor,
		design = 'basic',
		borderRadius = '',
		shadow = '',
		showNumber = true,
		showTitle = true,
		showDescription = true,
		titleTag = '',
		numberStyle = '',
		num1 = '',
		num2 = '',
		num3 = '',
		numberOpacity = '',
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
					className="ugb--help-tip-column-background-on-off"
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

			<PanelSpacingBody initialOpen={ false } blockProps={ props }>
				<ColumnPaddingControl
					label={ __( 'Paddings', i18n ) }
					setAttributes={ setAttributes }
					attributes={ props.attributes }
				/>
				{ show.numberSpacing && (
					<ResponsiveControl
						attrNameTemplate="number%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Number', i18n ) }
							min={ -50 }
							max={ 100 }
							placeholder="16"
							allowReset={ true }
							className="ugb--help-tip-spacing-number"
						/>
					</ResponsiveControl>
				) }
				{ show.titleSpacing && (
					<ResponsiveControl
						attrNameTemplate="title%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Title', i18n ) }
							min={ -50 }
							max={ 100 }
							placeholder="16"
							allowReset={ true }
							className="ugb--help-tip-spacing-title"
						/>
					</ResponsiveControl>
				) }
				{ show.descriptionSpacing && (
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
				) }
			</PanelSpacingBody>

			<PanelAdvancedSettings
				title={ __( 'Number', i18n ) }
				id="number"
				checked={ showNumber }
				onChange={ showNumber => setAttributes( { showNumber } ) }
				toggleOnSetAttributes={ [
					...createTypographyAttributeNames( 'number%s' ),
					'num1',
					'num2',
					'num3',
					...createResponsiveAttributeNames( 'number%sPadding' ),
					'numberStyle',
					'numberColor',
					'numberOpacity',
					...createResponsiveAttributeNames( 'Number%sAlign' ),
				] }
				hasToggle
				toggleAttributeName="showNumber"
			>
				<TextControl
					label={ sprintf( _x( '%s %d %s', 'Nth Title with description', i18n ), __( 'Number', i18n ), 1, __( 'Label', i18n ) ) }
					value={ num1 }
					onChange={ num1 => setAttributes( { num1 } ) }
				/>
				{ columns !== '' && columns >= 2 && (
					<TextControl
						label={ sprintf( _x( '%s %d %s', 'Nth Title with description', i18n ), __( 'Number', i18n ), 2, __( 'Label', i18n ) ) }
						value={ num2 }
						onChange={ num2 => setAttributes( { num2 } ) }
					/>
				) }
				{ columns !== '' && columns >= 3 && (
					<TextControl
						label={ sprintf( _x( '%s %d %s', 'Nth Title with description', i18n ), __( 'Number', i18n ), 3, __( 'Label', i18n ) ) }
						value={ num3 }
						onChange={ num3 => setAttributes( { num3 } ) }
					/>
				) }
				<TypographyControlHelper
					attrNameTemplate="number%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
					fontSizeProps={ {
						max: design === 'basic' || design === 'plain' ? [ 150, 7 ] : [ 500, 15 ],
						min: [ 0, 1 ],
					} }
					placeholder={ size => size * 3 } // 3em.
				/>
				{ show.numberStyle && (
					<SelectControl
						label={ __( 'Number Shape', i18n ) }
						options={ [
							{ label: __( 'None', i18n ), value: 'none' },
							{ label: __( 'Circle', i18n ), value: '' },
							{ label: __( 'Square', i18n ), value: 'square' },
						] }
						value={ numberStyle }
						onChange={ numberStyle => setAttributes( { numberStyle } ) }
					/>
				) }
				{ show.numberBGColor && (
					<ResponsiveControl
						attrNameTemplate="number%sPadding"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Shape Size', i18n ) }
							min={ 0 }
							max={ 5 }
							step={ 0.1 }
							allowReset={ true }
							placeholder="2.5"
						/>
					</ResponsiveControl>
				) }
				{ show.numberBGColor && (
					<ColorPaletteControl
						value={ numberBGColor }
						onChange={ numberBGColor => setAttributes( { numberBGColor } ) }
						label={ __( 'Number Background Color', i18n ) }
					/>
				) }
				{ show.numberColor && (
					<ColorPaletteControl
						value={ numberColor }
						onChange={ numberColor => setAttributes( { numberColor } ) }
						label={ __( 'Number Color', i18n ) }
					/>
				) }
				<AdvancedRangeControl
					label={ __( 'Opacity', i18n ) }
					min={ 0 }
					max={ 1.0 }
					step={ 0.1 }
					value={ numberOpacity }
					onChange={ numberOpacity => setAttributes( { numberOpacity } ) }
					allowReset={ true }
					placeholder="1.0"
				/>
				<ResponsiveControl
					attrNameTemplate="Number%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-number"
					/>
				</ResponsiveControl>
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
		columns,
		design = 'basic',
		titleTag = '',
		shadow = '',
		showNumber = true,
		showTitle = true,
		showDescription = true,
		numberStyle = '',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-number-box--v3',
		`ugb-number-box--columns-${ columns }`,
	], applyFilters( 'stackable.number-box.mainclasses', {
		[ `ugb-number-box--design-${ design }` ]: design !== 'basic',
		[ `ugb-number-box--number-style-${ numberStyle }` ]: numberStyle !== '' && ( design === 'basic' || design === 'plain' ),
	}, design, props ) )

	const show = showOptions( props )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ range( 1, columns + 1 ).map( i => {
					const num = attributes[ `num${ i }` ]
					const title = attributes[ `title${ i }` ]
					const description = attributes[ `description${ i }` ]

					const boxClasses = classnames( [
						'ugb-number-box__item',
						`ugb-number-box__item${ i }`,
					], applyFilters( 'stackable.number-box.boxclasses', {
						[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== '',
					}, design, props ) )

					return (
						<DivBackground
							className={ boxClasses }
							backgroundAttrName="column%s"
							blockProps={ props }
							showBackground={ show.columnBackground }
							index={ i }
							key={ i }
						>
							{ showNumber && (
								<RichText
									tagName="div"
									className="ugb-number-box__number"
									value={ num }
									onChange={ value => setAttributes( { [ `num${ i }` ]: value } ) }
								/>
							) }
							{ ( showTitle || showDescription ) && (
								<div className="ugb-number-box__content">
									{ showTitle && (
										<RichText
											tagName={ titleTag || 'h4' }
											value={ title }
											className="ugb-number-box__title"
											onChange={ value => setAttributes( { [ `title${ i }` ]: value } ) }
											placeholder={ __( 'Title', i18n ) }
											keepPlaceholderOnFocus
										/>
									) }
									{ showDescription && (
										<RichText
											tagName="p"
											value={ description }
											className="ugb-number-box__description"
											onChange={ value => setAttributes( { [ `description${ i }` ]: value } ) }
											placeholder={ descriptionPlaceholder() }
											keepPlaceholderOnFocus
										/>
									) }
								</div>
							) }
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
	withContentAlignReseter( [ 'Number%sAlign', 'Title%sAlign', 'Description%sAlign' ] ),
	withBlockStyles( createStyles, { editorMode: true } ),
	withClickOpenInspector( [
		[ '.ugb-number-box__item', 'column-background' ],
		[ '.ugb-number-box__number', 'number' ],
		[ '.ugb-number-box__title', 'title' ],
		[ '.ugb-number-box__description', 'description' ],
	] ),
)( edit )
