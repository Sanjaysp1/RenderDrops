export interface TeamMember {
  name: string;
  role: string;
  photo: string;
}

export interface TeamHead {
  name: string;
  role: string;
  photo: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  image: string;
  teamHead: TeamHead;
  members: TeamMember[];
}
