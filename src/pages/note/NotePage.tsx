import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import { categories } from "../../config";
import { selectNotes, setActive } from "../../store/slices/notesSlice";
import { useAppDispatch } from "../../store/store";
import { INote } from "../../types";
import { createNoteObj } from "../../utils/createNoteObj";
import { wrongTitle } from "../../utils/wrongTitle";

const NotePage = () => {
    const { slugParams } = useParams();
    const { activeNotes } = useSelector(selectNotes);
    const [note, setNote] = useState<INote | null>(null);
    const [showError, setShowError] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [category, setCategory] = useState(categories[0]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const titleRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (activeNotes) {
            const findItem = activeNotes.find((i) => i.slug === slugParams);
            if (findItem) {
                setNote(findItem);
            } else {
                setShowError(true);
            }
        }
        if (note) {
            setTitle(note.title);
            setContent(note.content);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [note]);

    if (showError) {
        return (
            <h3>
                no matches found for {slugParams}. Check that the slug params
                are correct
            </h3>
        );
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (note) {
            const editedNote = createNoteObj(
                activeNotes,
                title,
                content,
                category,
                note.id,
                note.creationDate
            );
            if (editedNote) {
                dispatch(setActive(editedNote));
                setIsEditable(false);
            } else {
                wrongTitle(titleRef);
            }
        }
    };

    const handleEditClick = () => {
        setIsEditable(!isEditable);
        titleRef.current && titleRef.current.focus();
    };

    return (
        <form
            className="flex flex-col items-start gap-5"
            onSubmit={(e) => handleSubmit(e)}
        >
            {note && (
                <>
                    <Link to="/notes" className="underline">
                        back
                    </Link>

                    <div className="flex items-center gap-2">
                        {!isEditable && (
                            <svg
                                onClick={handleEditClick}
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 490.305 490.305"
                                className="h-5 w-5 cursor-pointer opacity-50"
                            >
                                <path
                                    d="M472.469,81.443l-63.6-63.6c-13.1-16.4-53.2-30.2-83.4,0l-290.9,289.9l0,0c-4.4,4.4-6.5,10.1-6.2,15.6l-27.1,141.8
		c-4.2,16.2,11.9,26.6,22.9,25l147-29.2c4.2,0,7.3-2.1,10.4-5.2l290.9-289.8C495.469,142.943,495.469,104.443,472.469,81.443z
		 M354.669,46.043c6.3-7.3,18.8-7.3,26.1,0l17.3,17l-289.7,289.7l-30.1-30.4L354.669,46.043z M61.769,364.043l64.4,64.4l-80.1,15.8
		L61.769,364.043z M444.369,135.643l-276.8,276.8l-30.1-30.4l290-290l16.8,16.5C453.469,118.343,449.169,130.743,444.369,135.643z"
                                />
                            </svg>
                        )}

                        <Input
                            titleRef={titleRef}
                            title={title}
                            setTitle={setTitle}
                            isEditable={!isEditable}
                        />
                    </div>

                    <p>{note.creationDate}</p>

                    <Select
                        category={category}
                        isEditable={isEditable}
                        setCategory={setCategory}
                    />

                    <textarea
                        readOnly={!isEditable}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Enter content"
                        className="h-[400px] w-[400px] text-xl"
                    ></textarea>

                    {isEditable && (
                        <button className="btn" type="submit">
                            submit
                        </button>
                    )}
                </>
            )}
        </form>
    );
};

export default NotePage;
