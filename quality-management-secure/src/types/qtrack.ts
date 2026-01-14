// Q-TRACK Type Definitions

export type UserRole = 'admin' | 'qualite' | 'production' | 'maintenance' | 'standard';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
  departement: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export type NCGravite = 'mineure' | 'majeure' | 'critique';
export type NCStatut = 'ouvert' | 'en_analyse' | 'action_lancee' | 'clos';
export type NCType = 'produit' | 'processus' | 'service' | 'fournisseur' | 'client';

export interface NonConformite {
  id: string;
  reference: string;
  titre: string;
  description: string;
  type: NCType;
  gravite: NCGravite;
  statut: NCStatut;
  poste: string;
  departement: string;
  declarantId: string;
  declarantNom: string;
  responsableId?: string;
  responsableNom?: string;
  dateDeclaration: string;
  dateDetection: string;
  dateCloture?: string;
  causeRacine?: string;
  impactDescription?: string;
  pieceJointes?: string[];
  actions: ActionCorrective[];
}

export type ActionStatut = 'non_demarre' | 'en_cours' | 'termine' | 'en_retard';

export interface ActionCorrective {
  id: string;
  ncId: string;
  description: string;
  responsableId: string;
  responsableNom: string;
  dateEcheance: string;
  dateRealisation?: string;
  statut: ActionStatut;
  commentaire?: string;
  efficacite?: 'efficace' | 'partielle' | 'inefficace';
}

export interface KPIData {
  ncTotales: number;
  ncOuvertes: number;
  ncCritiques: number;
  ncMajeures: number;
  ncMineures: number;
  actionsEnRetard: number;
  tempsResolutionMoyen: number;
  tauxResolution: number;
  ncParMois: { mois: string; count: number }[];
  ncParType: { type: string; count: number }[];
  ncParGravite: { gravite: string; count: number }[];
  ncParStatut: { statut: string; count: number }[];
}

export interface Notification {
  id: string;
  type: 'nc_nouvelle' | 'nc_assignee' | 'action_echeance' | 'nc_cloturee' | 'systeme';
  titre: string;
  message: string;
  date: string;
  lu: boolean;
  lien?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userNom: string;
  action: string;
  entite: 'nc' | 'action' | 'user' | 'rapport';
  entiteId: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export type ViewType = 'dashboard' | 'nc_list' | 'nc_detail' | 'rapports' | 'utilisateurs' | 'parametres';
