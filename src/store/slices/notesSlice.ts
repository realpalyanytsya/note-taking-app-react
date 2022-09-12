import { prepopulatedData } from "./../../.data";
import { INote } from "./../../types/index";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

const getActiveFromLS = () => {
    const data = localStorage.getItem("active");
    return data ? JSON.parse(data) : prepopulatedData;
};

const getArchiveFromLS = () => {
    const data = localStorage.getItem("archive");
    return data ? JSON.parse(data) : null;
};

interface notesProps {
    activeNotes: INote[];
    archiveNotes: INote[] | null;
}

const initialState: notesProps = {
    activeNotes: getActiveFromLS(),
    archiveNotes: getArchiveFromLS(),
};

const notesSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        setActive(state, action: PayloadAction<INote>) {
            if (state.activeNotes) {
                const find = state.activeNotes.find(
                    (i) => i.id === action.payload.id
                );

                if (find) {
                    const index = state.activeNotes.indexOf(find);
                    state.activeNotes.splice(index, 1, action.payload);
                } else {
                    state.activeNotes = [...state.activeNotes, action.payload];
                }

                localStorage.setItem(
                    "active",
                    JSON.stringify(state.activeNotes)
                );
            }
        },
        deleteNote(state, action: PayloadAction<string>) {
            if (state.activeNotes) {
                const find = state.activeNotes.find(
                    (i) => i.slug === action.payload
                );

                if (find) {
                    const index = state.activeNotes.indexOf(find);
                    state.activeNotes.splice(index, 1);
                }

                localStorage.setItem(
                    "active",
                    JSON.stringify(state.activeNotes)
                );
            }
        },
        setArchive(state, action: PayloadAction<string>) {
            const find = state.activeNotes.find(
                (i) => i.slug === action.payload
            );
            notesSlice.caseReducers.deleteNote(state, action);
            if (find) {
                if (state.archiveNotes) {
                    state.archiveNotes = [...state.archiveNotes, find];
                } else {
                    state.archiveNotes = [find];
                }
            }
        },
    },
});

export const { setArchive, setActive, deleteNote } = notesSlice.actions;

export const selectNotes = (state: RootState) => state.notes;

export default notesSlice.reducer;
