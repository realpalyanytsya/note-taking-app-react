import React, { FC, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import { categories } from "../../config";
import { selectNotes, setActive } from "../../store/slices/notesSlice";
import { useAppDispatch } from "../../store/store";
import { createNoteObj } from "../../utils/createNoteObj";
import { wrongTitle } from "../../utils/wrongTitle";

const NewNotePage: FC = () => {
    const { activeNotes } = useSelector(selectNotes);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState(categories[0]);
    const [content, setContent] = useState("");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const titleRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const note = createNoteObj(
            activeNotes,
            title,
            content,
            category,
            Date.now()
        );
        if (note) {
            dispatch(setActive(note));
            navigate("/notes");
        } else {
            wrongTitle(titleRef);
            wrongTitle(contentRef);
        }
    };

    return (
        <form
            className="flex flex-col items-start gap-5"
            onSubmit={(e) => handleSubmit(e)}
        >
            <Input
                titleRef={titleRef}
                title={title}
                setTitle={setTitle}
                isEditable={false}
            />

            <Select
                category={category}
                isEditable={true}
                setCategory={setCategory}
            />

            <textarea
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter content"
                className="h-[400px] w-[400px] text-xl"
                maxLength={500}
                minLength={1}
            ></textarea>

            <button className="btn" type="submit">
                submit
            </button>
        </form>
    );
};

export default NewNotePage;
