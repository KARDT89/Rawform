import {db} from "@repo/database";
import { type CreateFormInputType, createFormInput } from "./model";
import { formsTable } from "@repo/database/models/form";
import ApiError from "../utils/api-errors";

class FormService {
    
    public async createForm(payload: CreateFormInputType) {
        const { title, description, createdBy } = await createFormInput.parseAsync(payload);

        const result = await db.insert(formsTable).values({
            title,
            description,
            createdBy
        }).returning({
            id: formsTable.id
        });

        if(!result || result.length === 0 || !result[0]?.id) throw new ApiError(500, "Failed to create form");

        return {id: result[0].id};
    }
}

export default FormService;