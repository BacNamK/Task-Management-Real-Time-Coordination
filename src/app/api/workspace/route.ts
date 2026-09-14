import { createWorkspace } from '@/src/server/actions/workspace.action';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const formData = await request.formData();
    const result = await createWorkspace(formData);

    if (!result) {
        return NextResponse.json(
            { success: false, message: 'Không thể tạo workspace' },
            { status: 400 },
        );
    }

    return NextResponse.json(result, { status: 201 });
}
