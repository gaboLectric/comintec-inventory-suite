import React from 'react';
import styled from '@emotion/styled';
import { GlassCard } from './GlassCard';

/**
 * MobileCard Component
 * 
 * A specialized card component optimized for mobile display of tabular data.
 * Transforms table rows into vertical card layouts with image, title, fields, and actions.
 */

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 100%;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--glass-border);
`;

const CardImage = styled.div`
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--glass-bg-light);
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardHeaderContent = styled.div`
  flex: 1;
  min-width: 0; /* Allow text truncation */
`;

const CardTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--font-color-primary);
  margin: 0 0 var(--space-1) 0;
  line-height: 1.3;
  
  /* Truncate long titles */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CardSubtitle = styled.p`
  font-size: var(--font-size-sm);
  color: var(--font-color-secondary);
  margin: 0;
  line-height: 1.4;
  
  /* Truncate long subtitles */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CardActions = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

const CardField = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-2);
  min-height: 20px;
`;

const FieldLabel = styled.span`
  font-size: var(--font-size-sm);
  color: var(--font-color-secondary);
  font-weight: var(--font-weight-medium);
  flex-shrink: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FieldValue = styled.span`
  font-size: var(--font-size-sm);
  color: var(--font-color-primary);
  text-align: right;
  word-break: break-word;
  line-height: 1.4;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  padding-top: var(--space-2);
  border-top: 1px solid var(--glass-border);
  margin-top: var(--space-1);
`;

const FooterActions = styled.div`
  display: flex;
  gap: var(--space-2);
  align-items: center;
`;

/**
 * MobileCard Component Props
 * @param {Object} item - Data item to display
 * @param {Array} columns - Column definitions from table
 * @param {React.ReactNode} actions - Action buttons/elements
 * @param {string} imageField - Field name for image data
 * @param {string} titleField - Field name for title
 * @param {string} subtitleField - Field name for subtitle
 * @param {Array} primaryFields - Fields to show prominently
 * @param {Array} secondaryFields - Fields to show in body
 * @param {React.ReactNode} footerContent - Additional footer content
 * @param {React.ReactNode} children - Custom body content (overrides secondaryFields)
 * @param {string} variant - Glass effect variant
 * @param {Function} onCardClick - Click handler for entire card
 */
export function MobileCard({
  item,
  columns = [],
  actions,
  imageField,
  titleField,
  subtitleField,
  primaryFields = [],
  secondaryFields = [],
  footerContent,
  variant = 'medium',
  onCardClick,
  className,
  children,
  ...props
}) {
  // Helper function to get field value
  const getFieldValue = (fieldName) => {
    if (!fieldName || !item) return null;
    return item[fieldName];
  };

  // Helper function to render field from column definition
  const renderColumnField = (column, value) => {
    if (column.render && typeof column.render === 'function') {
      return column.render(item);
    }
    return value;
  };

  // Find column definition for a field
  const findColumn = (fieldName) => {
    return columns.find(col => col.accessor === fieldName || col.header === fieldName);
  };

  // Get image source
  const imageValue = getFieldValue(imageField);
  const titleValue = getFieldValue(titleField);
  const subtitleValue = getFieldValue(subtitleField);

  // Filter fields that have values
  const visibleSecondaryFields = secondaryFields.filter(field => {
    const value = getFieldValue(field);
    return value !== null && value !== undefined && value !== '';
  });

  return (
    <GlassCard
      variant={variant}
      padding="md"
      hover={!!onCardClick}
      className={className}
      onClick={onCardClick}
      style={{ cursor: onCardClick ? 'pointer' : 'default' }}
      {...props}
    >
      <CardContent>
        {/* Header with image, title, subtitle, and primary actions */}
        <CardHeader>
          {imageField && imageValue && (
            <CardImage>
              {typeof imageValue === 'string' ? (
                <img src={imageValue} alt={titleValue || 'Item'} />
              ) : (
                imageValue
              )}
            </CardImage>
          )}
          
          <CardHeaderContent>
            {titleValue && (
              <CardTitle title={titleValue}>
                {titleValue}
              </CardTitle>
            )}
            {subtitleValue && (
              <CardSubtitle title={subtitleValue}>
                {subtitleValue}
              </CardSubtitle>
            )}
          </CardHeaderContent>
          
          {actions && (
            <CardActions>
              {actions}
            </CardActions>
          )}
        </CardHeader>

        {/* Body with secondary fields or custom children */}
        {children ? (
          <CardBody>
            {children}
          </CardBody>
        ) : visibleSecondaryFields.length > 0 ? (
          <CardBody>
            {visibleSecondaryFields.map((fieldName, index) => {
              const column = findColumn(fieldName);
              const value = getFieldValue(fieldName);
              const displayValue = column ? renderColumnField(column, value) : value;
              
              return (
                <CardField key={index}>
                  <FieldLabel>
                    {column?.header || fieldName}
                  </FieldLabel>
                  <FieldValue>
                    {displayValue}
                  </FieldValue>
                </CardField>
              );
            })}
          </CardBody>
        ) : null}

        {/* Footer with additional content */}
        {footerContent && (
          <CardFooter>
            {footerContent}
          </CardFooter>
        )}
      </CardContent>
    </GlassCard>
  );
}