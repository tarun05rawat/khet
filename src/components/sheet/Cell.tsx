import { CellContext } from "@tanstack/react-table";
import * as React from "react";

interface EditableCellProps<TData, TValue> extends CellContext<TData, TValue> {
  renderInput: (props: {
    value: TValue;
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    onBlur: () => void;
    onValueChange: (value: string) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    cancelEditing: () => void;
    className?: string;
    ref?: React.RefObject<HTMLInputElement | null>;
  }) => React.ReactElement;
  cellStyle?: React.CSSProperties; // Add this line
}

export default function Cell<TData, TValue>({
  getValue,
  row: { index: rowId },
  column: { id: colId },
  table,
  renderInput,
  cellStyle,
}: EditableCellProps<TData, TValue>): React.ReactElement {
  const initialValue = getValue();
  const [isEditing, setIsEditing] = React.useState(false);
  const [value, setValue] = React.useState<TValue>(initialValue);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const enhancedStyle = React.useMemo(() => {
    if (cellStyle && cellStyle.backgroundColor)
      return cellStyle;
  }, [cellStyle]);

  const onDoubleClick = () => setIsEditing(true);

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const cancelEditing = () => {
    setValue(initialValue);
    setIsEditing(false);
  };

  const onValueChange = (value: string) => {
    setValue(value as unknown as TValue);
    setIsEditing(false);
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValue(newValue as unknown as TValue)
  }

  const handleEndEditing = () => {
    setIsEditing(false);
  }

  const handleKeyDownEdit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEndEditing();
    } else if (e.key === 'Escape') {
      cancelEditing();
    } else if (e.key === 'Tab') {
      handleEndEditing();
    } else {
      e.stopPropagation();
    }
  }

  const handleKeyDownOnView = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      setIsEditing(true);
    }
  }

  const handleBlur = () => handleEndEditing();

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])


  return (
    <>
      {isEditing ? (
        <div
          onDoubleClick={onDoubleClick}
          className="bg-transparent w-full h-full"
          tabIndex={0}
          data-row={rowId}
          data-column={colId}
          style={cellStyle} // Use original style without border for editing mode
        >
          {renderInput({
            value,
            onChange,
            onBlur: handleBlur,
            onValueChange,
            onKeyDown: handleKeyDownEdit,
            cancelEditing,
            className: "font-normal bg-transparent w-full h-full py-[5px] border-none rounded-none focus:ring-3 focus:ring-blue-400 focus-visible:ring-blue-400 focus-visible:ring-offset-0 hover:bg-transparent text-xs",
            ref: inputRef
          })}
        </div>
      ) : (
        <div
          onKeyDown={handleKeyDownOnView}
          onDoubleClick={onDoubleClick}
          className="font-normal w-full h-full select-none cursor-pointer border-0 focus:outline-1 focus:outline-blue-400 focus:outline min-h-[24px] flex items-center text-xs work-sans-text"
          tabIndex={0}
          data-row={rowId}
          data-column={colId}
          style={enhancedStyle} // Apply enhanced style with matching border
        >
          <span className="px-1">
            {value ? String(value) : ""}
          </span>
        </div>
      )}
    </>
  );
}