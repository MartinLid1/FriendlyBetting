type SignatoryField = {
	type: string;
	order?: number;
	value: string;
	is_obligatory: boolean;
	should_be_filled_by_sender: boolean;
	editable_by_signatory: boolean;
	placements: any[];
	description: string | null;
};

type Signatory = {
	is_signatory: boolean;
	signatory_role: string;
	fields: SignatoryField[];
};