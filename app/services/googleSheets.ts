import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

const credentials = {
  type: 'service_account',
  project_id: 'poker-tournament-457415',
  private_key_id: 'fcea0de4948e787064cba1c68a79a126afe4a304',
  private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCjGI87fmjgQlnt\nm9xNRyXfvT+SpSKNniLYcLDIUUmOKsUj3boSswCObcyuSTNFOCHZLF5QiVb5kybC\nfQsPpsyYM985O13qqIJeNq6yJ9xMTF+RImHK8nibNYpe0YrijdlZLnZWFfxDefCD\nUlewLflWYVvwVHqe+2GG1SWMj357CAQ3dJsLXwWjNi9fm2bZsgGjzC3h1jQGGo4V\nf+EzKXn6hCjeASE1ZWTVydy788olYM2Af9gKF2mRC7nOt9PHn5cPVXMf0VDeTzh1\ns38jqn4goGZiGn2Ge14MI2bdhVj3C4UTkeS2/abNp+uy8q3SSHCI9Q0guVYX3ncP\nnNyqvn6PAgMBAAECggEAAIP7hpgeiRWcnCmBzPARzhRr5tuacYZ+R181J9pImGhJ\nND+nWWzIboApWqRaQviWSXigRF09caTbRVfI2P/8JepaunRra7+kSIZKuhRx1/87\nzsUkOFSDjhYMExhSzzwx44bH5/tszzfLoKv6IVFGjaqEHw0ypV2tEBSMvauByQNw\nWIqckZ3dihCPIr0+2PxIqUp/IlrBy54XyhxS4o94duSaPooaix14uFXOiPt/kt0/\nXbCxgPYWV+GX+ch3g6WLxtlvhnxiSteXh0GB0PrySyghMNWN37Q6srFQ658ke1mX\n5DJb4PbMsYCu/i4raSZICn4bjiD5E82JTSnZtDynTQKBgQDaQh0PKmK3YxGH+P+C\nKgwKfyP8QOPp0PCGJvSRRQacHuKBFgEDrEM+HMuodY8BNIWyL4pMw/tu3IIb/CM5\nhezqpCAzpQds01boKzOi/9ettYSkS+nNSVHP4N+E/QBT7YREkCS1GTelGzhUdUpw\n0lhNsabMOZEY5tfbz2p0LYyrnQKBgQC/TINHOGQejkincavZsO10rqgUkTjz3L4F\nNXVH1c5lIcdhlOfqmcwPe5XyN++HNKEnwBnCEoIq7+4XsX4yuk/pGS6bOdHI/VBq\nbeEvxco81AiWQ2c3BnUOKZmgDIQRZ1mk3byXOUD44SIoZnDuIx/jRlY6BTEL1XEp\nUU8zCglpGwKBgHY3QxgYxBlCXpeAZZxx+82fqbUSzJ+zXOO8q9EXSwo6rEJw0aHU\npyM4Y5LeAdQMR7IIj+cea8xTQWG5ArdAc99vgEWYyFnIapUb+T77Ri2/WJXIzF01\nrktjKI4WnxvWVULxtAAnJX2XLb6JPQW42L1UUNzi/VU4i4hyYt2EYmH9AoGADrYj\nomaDzJXEoJvtS2B/4mlMI8jHSHnBY0UpL80RglWGr8pzy2boeohWj7odgZhajGQJ\nlxM1T3gEJ25O9je9zX9SRj28FGjmtkic+L+NPgBQaL3mQiUM+3nXhqdvwKbiDfu/\ndSHCDWHC7rhyFt48pY3TM8MScoaHnVXTcWlkL+ECgYA0CRPBG28Oe5Q/d+gZv30R\n5MEclheqXthbox4u9owBIlTuhtN9S1Jnly99WXy9fbFkTNwEnkTGAem3XQZnlr6F\nhlCXNrXmXxRowASOWDb3/uKnO74Jg3jnGmysxUhkc2obpHF27d87S7Lgm8M7YHvL\nQ5ql7kB8ilH/RdFgmSjWZA==\n-----END PRIVATE KEY-----\n',
  client_email: 'poker-helper@poker-tournament-457415.iam.gserviceaccount.com',
  client_id: '108262175887997208176',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/poker-helper%40poker-tournament-457415.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com'
};

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

export class GoogleSheetsService {
  private auth: JWT;
  private sheets: any;

  constructor() {
    this.auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: SCOPES,
    });

    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  async getTournamentData(spreadsheetId: string, range: string) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      return response.data.values;
    } catch (error) {
      console.error('Error fetching data from Google Sheets:', error);
      throw error;
    }
  }

  async updateTournamentData(spreadsheetId: string, range: string, values: any[][]) {
    try {
      const response = await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {
          values,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error updating data in Google Sheets:', error);
      throw error;
    }
  }
} 